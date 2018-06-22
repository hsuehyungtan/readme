import _ from 'lodash'
import {
  checkLoginStatus,
  createProject,
  createReport,
  deleteProject,
  fetchPeopleByName,
  fetchProjects,
  fetchReports,
  getProfile,
  getMember,
  getMemosCount,
  getProjectsCount,
  getReportsCount,
  updateProject,
  updateReport,
  uploadImage,
  createMemo,
  fetchMemos,
  updateMemo,
  deleteMemos,
  deleteReport,
} from 'src/api'

const debug = require('debug')('CLIENT:actions')

export default {
  CHECK_LOGIN_STATUS: ({ commit, dispatch, state }, { params }) => {
    return checkLoginStatus({ params }).then(({ status, body }) => {
      commit('SET_LOGGEDIN_STATUS', { status, body })
    })
  },

  CREATE_PROJECT: ({ commit, state }, { params }) => {
    debug('Going to send proj creating req.')
    return createProject({ params })
  },

  CREATE_REPORT: ({ commit, state }, { params }) => {
    debug('Going to send report creating req.')
    return createReport({ params })
  },

  DELETE_PROJECT: ({ commit, state }, { params }) => {
    return deleteProject({ params })
  },

  DELETE_REPORT: ({ commit, state }, { params }) => {
    return deleteReport({ params })
  },

  FETCH_PEOPLE_BY_NAME: ({ commit, state }, { params }) => {
    return fetchPeopleByName({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PEOPLE_LIST', { people: _.get(body, 'items', []) })
      }
    })
  },

  FETCH_PROJECTS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchProjects({ params })
      .then((projects) => commit('SET_PROJECTS', { projects }))
  },

  FETCH_REPORTS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchReports({ params })
      .then((reports) => commit('SET_REPORTS', { reports }))
  },

  GET_MEMOS_COUNT: ({ commit, state }) => {
    return getMemosCount()
      .then(({ status, body }) => status === 200 && commit('SET_MEMOS_COUNT', { count: _.get(body, 'meta.total') }))
  },

  GET_PROJECTS_COUNT: ({ commit, state }) => {
    return getProjectsCount()
      .then(({ status, body }) => status === 200 && commit('SET_PROJECTS_COUNT', { count: _.get(body, 'meta.total') }))
  },

  GET_REPORTS_COUNT: ({ commit, state }, { params }) => {
    return getReportsCount({ params })
      .then(({ status, body }) => status === 200 && commit('SET_REPORTS_COUNT', { count: _.get(body, 'meta.total') }))
  },

  GET_PROFILE: ({ commit, dispatch, state }, { params }) => {
    return getProfile({ params }).then(({ status, body }) => {
      if (status === 200) {
        commit('SET_PROFILE', { profile: body })
      }
    })
  },

  GET_MEMBER: ({ commit, dispatch, state }, { params }) => {
    return getMember({ params }).then(({ status, body }) => {
      if (status === 200) {
        return body
      }
    })
  },

  UPDATE_PROJECT: ({ commit, state }, { params }) => {
    debug('Going to sen proj updateing req.')
    return updateProject({ params })
  },

  UPDATE_REPORT: ({ commit, state }, { params }) => {
    debug('Going to sen proj updateing req.')
    return updateReport({ params })
  },

  UPLOAD_IMAGE: ({ commit, dispatch }, { file, type }) => {
    return uploadImage(file, type)
  },

  CREATE_MEMO: ({ commit, state }, { params }) => {
    debug('Going to send memo creating req.')
    return createMemo({ params })
  },
  FETCH_MEMOS: ({ commit, state }, { params }) => {
    debug('Abt to fetch data.')
    return fetchMemos({ params })
      .then((memos) => commit('SET_MEMOS', { memos }))
  },
  UPDATE_MEMO: ({ commit, state }, { params }) => {
    debug('Going to sen memo updateing req.')
    return updateMemo({ params })
  },
  DELETE_MEMOS: ({ commit, state }, { params }) => {
    debug('Going to sen memo delete req.')
    return deleteMemos({ params }).then(() => { commit('REMOVE_MEMOS', params.ids) })
  },
}
