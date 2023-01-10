const Card = require('../models/card');
const {
  validationErrorAnswer,
  notFoundErrorAnswer,
  defaultErrorAnswer
} = require('../utils/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;

  if(!name || !link) return validationErrorAnswer(res, "Переданы некорректные данные при создании карточки");

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === "ValidationError") return validationErrorAnswer(res, "Переданы некорректные данные при создании карточки");

      defaultErrorAnswer(res)
    });
}
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => defaultErrorAnswer(res));
}

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findOneAndRemove({_id: cardId})
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === "CastError") return validationErrorAnswer(res, "Карточка с указанным _id не найдена");

      defaultErrorAnswer(res);
    });
}

const addLikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then((card) => {
      res.status(200).send(card)
    })
    .catch((error) => {
      if (error.name === "CastError") return validationErrorAnswer(res, "Передан несуществующий _id карточки");
      if (error.name === "ValidationError") return validationErrorAnswer(res, "Переданы некорректные данные для постановки/снятии лайка");

      defaultErrorAnswer(res);
    });
}

const deleteLikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === "CastError") return validationErrorAnswer(res, "Передан несуществующий _id карточки");

      defaultErrorAnswer(res)
    });
}

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  addLikeCard,
  deleteLikeCard
}
