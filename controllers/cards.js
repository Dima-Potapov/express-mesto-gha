const Card = require('../models/card');
const CastError = require('../utils/errors');

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
      if (error.name === 'ValidationError') throw new CastError('Переданы некорректные данные при создании карточки', 400);

      next(error);
    });
};
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200)
      .send(cards))
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .populate('owner')
    .then((card) => {
      if (!card) throw new CastError('Карточка с указанным _id не найдена', 404);
      if (card.owner._id.valueOf() !== userId) throw new CastError('Нельзя удалить чужую карточку', 403);

      Card.findByIdAndDelete(card._id)
        .then((removedCard) => res.status(200)
          .send(removedCard))
        .catch(next);
    })
    .catch(next);
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
      if (!card) return next(new CastError('Передан несуществующий _id', 404));

      return res.status(200)
        .send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') throw new CastError('Передан несуществующий _id карточки', 400);
      if (error.name === 'ValidationError') throw new CastError('Переданы некорректные данные для постановки/снятии лайка', 400);

      return error;
    })
    .catch(next);
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
      if (!card) throw new CastError('Передан несуществующий _id', 404);

      res.status(200)
        .send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') throw new CastError('Передан несуществующий _id карточки', 400);

      next(error);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  addLikeCard,
  deleteLikeCard,
};
