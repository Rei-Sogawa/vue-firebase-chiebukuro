import * as fb from '../../common/firebase.config'

const initialState = {
  question: null,
  unwatchQuestion: null,
  answers: [],
  unwatchAnswers: null
}

const state = {
  ...initialState
}

const getters = {
  question(state) {
    return state.question
  },
  bestAnswer(state) {
    return state.answers.find(
      answer => answer.id === state.question.bestAnswer.id
    )
  },
  otherAnswers(state) {
    return state.answers.filter(
      answer => answer.id !== state.question.bestAnswer.id
    )
  },
  answersCount(state) {
    return state.answers.length
  }
}

const actions = {
  watchQuestion(context, id) {
    const unwatchQuestion = fb.questionsCollection
      .doc(id)
      .onSnapshot(async questionDoc => {
        if (!questionDoc.data()) {
          // question を削除後も watch は動くが、参照する question はないので return する
          return
        }
        const userId = questionDoc.data().user.id
        const userDoc = await fb.usersCollection.doc(userId).get()
        const question = Object.assign(
          { id: questionDoc.id, ...questionDoc.data() },
          { user: { id: userDoc.id, ...userDoc.data() } }
        )
        context.commit('SET_QUESTION', question)
      })
    context.commit('SET_UNWATCH_QUESTION', unwatchQuestion)
  },
  resetQuestion(context) {
    context.commit('UNWATCH_QUESTION')
    context.commit('SET_QUESTION', initialState.question)
    context.commit('SET_UNWATCH_QUESTION', initialState.unwatchQuestion)
  },
  watchAnswers(context, id) {
    const unwatchAnswers = fb.answersCollection
      .where('question.id', '==', id)
      .orderBy('createdAt', 'desc')
      .onSnapshot(async snapshot => {
        const answersDoc = snapshot.docs
        const getUsersDoc = answersDoc.map(answerDoc => {
          const userId = answerDoc.data().user.id
          return fb.usersCollection.doc(userId).get()
        })
        const usersDoc = await Promise.all(getUsersDoc)
        const answers = answersDoc.map((answerDoc, index) =>
          Object.assign(
            { id: answerDoc.id, ...answerDoc.data() },
            { user: { id: usersDoc[index].id, ...usersDoc[index].data() } }
          )
        )
        context.commit('SET_ANSWERS', answers)
      })
    context.commit('SET_UNWATCH_ANSWERS', unwatchAnswers)
  },
  resetAnswers(context) {
    context.commit('UNWATCH_ANSWERS')
    context.commit('SET_ANSWERS', initialState.answers)
    context.commit('SET_UNWATCH_ANSWERS', initialState.unwatchAnswers)
  },

  // firebase.firestore の処理は vuex 経由で
  createQuestion(context, question) {
    return fb.questionsCollection.add(question)
  },
  deleteQuestion(context, questionId) {
    return fb.questionsCollection.doc(questionId).delete()
  },
  selectBestAnswer(context, { questionId, bestAnswerId }) {
    return fb.questionsCollection
      .doc(questionId)
      .update({ bestAnswer: { id: bestAnswerId } })
  },
  createAnswer(context, answer) {
    return fb.answersCollection.add(answer)
  },
  deleteAnswer(context, answerId) {
    return fb.answersCollection.doc(answerId).delete()
  }
}

const mutations = {
  SET_QUESTION(state, question) {
    state.question = question
  },
  SET_UNWATCH_QUESTION(state, unwatchQuestion) {
    state.unwatchQuestion = unwatchQuestion
  },
  UNWATCH_QUESTION(state) {
    state.unwatchQuestion()
  },
  SET_ANSWERS(state, answers) {
    state.answers = answers
  },
  SET_UNWATCH_ANSWERS(state, unwatchAnswers) {
    state.unwatchAnswers = unwatchAnswers
  },
  UNWATCH_ANSWERS(state) {
    state.unwatchAnswers()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
