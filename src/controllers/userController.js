const bcrypt = require('bcrypt');
const { User } = require('../models');

async function getById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'firstname', 'surname', 'email'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    if (!firstname || !surname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não conferem' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      surname,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { firstname, surname, email } = req.body;

    if (!firstname && !surname && !email) {
      return res.status(400).json({ message: 'Nenhum dado informado para atualização' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.update({
      ...(firstname && { firstname }),
      ...(surname && { surname }),
      ...(email && { email }),
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getById,
  create,
  update,
  remove,
};
