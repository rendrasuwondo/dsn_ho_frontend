export const state = () => ({
  queryString: 'default',
  afdeling: [],
  department: [],
  company: [],
  afdelingId: null,
  departmentId: null,
  companyId: null,
  dateStart: null,
  dateEnd: null,
});

export const mutations = {
  updateDashboardState(state, payload) {
    state.queryString = payload['query'];
  },
  updateAfdelingState(state, payload) {
    state.afdeling = payload;
  },
  updateAfdelingIdState(state, payload) {
    state.afdelingId = payload;
  },
  updateDepartmentState(state, payload) {
    state.department = payload;
  },
  updateDepartmentIdState(state, payload) {
    state.departmentId = payload;
  },
  updateCompanyState(state, payload) {
    state.company = payload;
  },
  updateCompanyIdState(state, payload) {
    state.companyId = payload;
  },
  updateDateStartState(state, payload) {
    state.dateStart = payload;
  },
  updateDateEndState(state, payload) {
    state.dateEnd = payload;
  },
};

