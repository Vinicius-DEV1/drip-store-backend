const { Op } = require('sequelize');
const { Product, Category, ProductImage, ProductOption } = require('../models');

async function search(req, res) {
  try {
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 12;
    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    if (Number.isNaN(limit) || Number.isNaN(page) || page < 1) {
      return res.status(400).json({ message: 'Parâmetros de paginação inválidos' });
    }
    

    const where = {};

    if (req.query.match) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.match}%` } },
        { description: { [Op.like]: `%${req.query.match}%` } },
      ];
    }

    if (req.query['price-range']) {
      const [min, max] = req.query['price-range'].split('-').map(Number);
      where.price = { [Op.between]: [min, max] };
    }

    const include = [
      { model: ProductImage, as: 'images' },
      { model: ProductOption, as: 'options' },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ];

    if (req.query.category_ids) {
      const ids = req.query.category_ids.split(',').map(Number);
      include[2] = {
        model: Category,
        as: 'categories',
        where: { id: { [Op.in]: ids } },
        through: { attributes: [] },
      };
    }

    const options = { where, include, distinct: true };
    if (limit !== -1) {
      options.limit = limit;
      options.offset = (page - 1) * limit;
    }

    const { count, rows } = await Product.findAndCountAll(options);

    const data = rows.map((p) => {
      const item = {
        id: p.id,
        enabled: p.enabled,
        name: p.name,
        slug: p.slug,
        stock: p.stock,
        description: p.description,
        price: p.price,
        price_with_discount: p.price_with_discount,
        category_ids: p.categories.map((c) => c.id),
        images: p.images.map((img) => ({ id: img.id, content: img.path })),
        options: p.options.map((opt) => ({
          id: opt.id,
          title: opt.title,
          shape: opt.shape,
          radius: opt.radius,
          type: opt.type,
          values: opt.values.split(','),
        })),
      };

      if (req.query.fields) {
        const filtered = {};
        req.query.fields.split(',').forEach((f) => {
          const key = f.trim();
          if (key in item) filtered[key] = item[key];
        });
        return filtered;
      }

      return item;
    });

    return res.status(200).json({ data, total: count, limit, page });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const p = await Product.findByPk(req.params.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });

    if (!p) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    return res.status(200).json({
      id: p.id,
      enabled: p.enabled,
      name: p.name,
      slug: p.slug,
      stock: p.stock,
      description: p.description,
      price: p.price,
      price_with_discount: p.price_with_discount,
      category_ids: p.categories.map((c) => c.id),
      images: p.images.map((img) => ({ id: img.id, content: img.path })),
      options: p.options.map((opt) => ({
        id: opt.id,
        title: opt.title,
        shape: opt.shape,
        radius: opt.radius,
        type: opt.type,
        values: opt.values.split(','),
      })),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const {
      enabled,
      name,
      slug,
      use_in_menu,
      stock,
      description,
      price,
      price_with_discount,
      category_ids,
      images,
      options,
    } = req.body;

    if (!name || !slug || price === undefined || price_with_discount === undefined) {
      return res.status(400).json({ message: 'Campos obrigatórios não informados' });
    }

    const product = await Product.create({
      enabled: Boolean(enabled),
      name,
      slug,
      use_in_menu: Boolean(use_in_menu),
      stock: stock || 0,
      description,
      price,
      price_with_discount,
    });

    if (category_ids && category_ids.length > 0) {
      await product.setCategories(category_ids);
    }

    if (images && images.length > 0) {
      await ProductImage.bulkCreate(
        images.map((img) => ({
          product_id: product.id,
          enabled: true,
          path: img.content,
        }))
      );
    }

    if (options && options.length > 0) {
      await ProductOption.bulkCreate(
        options.map((opt) => {
          const vals = opt.values || opt.value || [];
          return {
            product_id: product.id,
            title: opt.title,
            shape: opt.shape || 'square',
            radius: parseInt(opt.radius, 10) || 0,
            type: opt.type || 'text',
            values: Array.isArray(vals) ? vals.join(',') : String(vals),
          };
        })
      );
    }

    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const { category_ids, images, options, ...dados } = req.body;
    await product.update(dados);

    if (category_ids) {
      await product.setCategories(category_ids);
    }

    if (images) {
      for (const img of images) {
        if (img.id && img.deleted) {
          await ProductImage.destroy({ where: { id: img.id, product_id: product.id } });
        } else if (img.id && img.content) {
          await ProductImage.update({ path: img.content }, { where: { id: img.id } });
        } else if (img.content) {
          await ProductImage.create({ product_id: product.id, enabled: true, path: img.content });
        }
      }
    }

    if (options) {
      for (const opt of options) {
        if (opt.id && opt.deleted) {
          await ProductOption.destroy({ where: { id: opt.id, product_id: product.id } });
        } else if (opt.id) {
          const vals = opt.values || opt.value;
          await ProductOption.update(
            {
              ...(opt.title && { title: opt.title }),
              ...(opt.radius !== undefined && { radius: parseInt(opt.radius, 10) || 0 }),
              ...(vals && { values: Array.isArray(vals) ? vals.join(',') : String(vals) }),
            },
            { where: { id: opt.id } }
          );
        } else {
          const vals = opt.values || opt.value || [];
          await ProductOption.create({
            product_id: product.id,
            title: opt.title,
            shape: opt.shape || 'square',
            radius: parseInt(opt.radius, 10) || 0,
            type: opt.type || 'text',
            values: Array.isArray(vals) ? vals.join(',') : String(vals),
          });
        }
      }
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { search, getById, create, update, remove };
