const Card = require('../models/card');
const {
  validationError,
  defaultError,
  notFoundError,
} = require('../utils/errors');

const createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201)
      .send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') return next(validationError('Переданы некорректные данные при создании карточки'));

      next(defaultError());
    });
};
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200)
      .send(cards))
    .catch(() => next(defaultError()));
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .populate('owner')
    .then((card) => {
      if (!card || card.owner._id.valueOf() !== userId) return next(validationError('Карточка с указанным _id не найдена'));

      Card.findByIdAndDelete(card._id)
        .then((removedCard) => res.status(200)
          .send(removedCard));
    })
    .catch((error) => {
      if (error.name === 'CastError') return next(validationError('Карточка с указанным _id не найдена'));

      next(defaultError());
    });
};

const addLikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((card) => {
      if (!card) return next(notFoundError('Передан несуществующий _id'));

      res.status(200)
        .send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') return next(validationError('Передан несуществующий _id карточки'));
      if (error.name === 'ValidationError') return next(validationError('Переданы некорректные данные для постановки/снятии лайка'));

      next(defaultError());
    });
};

const deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((card) => {
      if (!card) return next(notFoundError('Передан несуществующий _id'));

      res.status(200)
        .send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') return next(validationError('Передан несуществующий _id карточки'));

      next(defaultError());
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  addLikeCard,
  deleteLikeCard,
};
