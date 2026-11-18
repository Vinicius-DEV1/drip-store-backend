const { Category } = require('../models');

async function search(req, res) {
  try {
    const limitParam = req.query.limit !== undefined ? Number(req.query.limit) : 12;
    const pageParam = req.query.page !== undefined ? Number(req.query.page) : 1;

    if (Number.isNaN(limitParam) || Number.isNaN(pageParam) || pageParam < 1) {
      return res.status(400).json({ message: 'Parâmetros de paginação inválidos' });
    }

    const where = {};
    if (req.query.use_in_menu !== undefined) {
      if (req.query.use_in_menu !== 'true' && req.query.use_in_menu !== 'false') {
        return res.status(400).json({ message: 'Parâmetro use_in_menu inválido' });
      }
      where.use_in_menu = req.query.use_in_menu === 'true';
    }

    const options = { where };

    if (req.query.fields) {
      options.attributes = req.query.fields.split(',').map((field) => field.trim());
    } else {
      options.attributes = ['id', 'name', 'slug', 'use_in_menu'];
    }

    if (limitParam !== -1) {
      options.limit = limitParam;
      options.offset = (pageParam - 1) * limitParam;
    }

    const { count, rows } = await Category.findAndCountAll(options);

    return res.status(200).json({
      data: rows,
      total: count,
      limit: limitParam,
      page: pageParam,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const category = await Category.findByPk(req.params.id, {
      attributes: ['id', 'name', 'slug', 'use_in_menu'],
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Nome e slug são obrigatórios' });
    }

    const category = await Category.create({
      name,
      slug,
      use_in_menu: Boolean(use_in_menu),
    });

    return res.status(201).json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      use_in_menu: category.use_in_menu,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Nome e slug são obrigatórios' });
    }

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.update({
      name,
      slug,
      use_in_menu: use_in_menu !== undefined ? Boolean(use_in_menu) : category.use_in_menu,
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  search,
  getById,
  create,
  update,
  remove,
};
