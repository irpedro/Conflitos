import { apiRequest } from "./queryClient";

export const api = {
  // Statistics
  getStatistics: async () => {
    const res = await apiRequest("GET", "/api/statistics");
    return res.json();
  },

  // Conflicts
  getConflicts: async () => {
    const res = await apiRequest("GET", "/api/conflicts");
    return res.json();
  },

  getConflictById: async (id: string) => {
    const res = await apiRequest("GET", `/api/conflicts/${id}`);
    return res.json();
  },

  createConflict: async (conflict: any) => {
    const res = await apiRequest("POST", "/api/conflicts", conflict);
    return res.json();
  },

  updateConflict: async (id: string, conflict: any) => {
    const res = await apiRequest("PUT", `/api/conflicts/${id}`, conflict);
    return res.json();
  },

  deleteConflict: async (id: string) => {
    await apiRequest("DELETE", `/api/conflicts/${id}`);
  },

  // Armed Groups
  getArmedGroups: async () => {
    const res = await apiRequest("GET", "/api/armed-groups");
    return res.json();
  },

  createArmedGroup: async (group: any) => {
    const res = await apiRequest("POST", "/api/armed-groups", group);
    return res.json();
  },

  // Divisions
  getDivisions: async () => {
    const res = await apiRequest("GET", "/api/divisions");
    return res.json();
  },

  createDivision: async (division: any) => {
    const res = await apiRequest("POST", "/api/divisions", division);
    return res.json();
  },

  // Political Leaders
  getPoliticalLeaders: async () => {
    const res = await apiRequest("GET", "/api/political-leaders");
    return res.json();
  },

  createPoliticalLeader: async (leader: any) => {
    const res = await apiRequest("POST", "/api/political-leaders", leader);
    return res.json();
  },

  // Military Chiefs
  getMilitaryChiefs: async () => {
    const res = await apiRequest("GET", "/api/military-chiefs");
    return res.json();
  },

  createMilitaryChief: async (chief: any) => {
    const res = await apiRequest("POST", "/api/military-chiefs", chief);
    return res.json();
  },

  // Mediator Organizations
  getMediatorOrgs: async () => {
    const res = await apiRequest("GET", "/api/mediator-orgs");
    return res.json();
  },

  // Reports
  getConflictsByType: async () => {
    const res = await apiRequest("GET", "/api/reports/conflicts-by-type");
    return res.json();
  },

  getConflictsByRegion: async () => {
    const res = await apiRequest("GET", "/api/reports/conflicts-by-region");
    return res.json();
  },

  getGroupsByLosses: async () => {
    const res = await apiRequest("GET", "/api/reports/groups-by-losses");
    return res.json();
  },

  getActiveMediators: async () => {
    const res = await apiRequest("GET", "/api/reports/active-mediators");
    return res.json();
  },

  getWeaponsByPower: async () => {
    const res = await apiRequest("GET", "/api/reports/weapons-by-power");
    return res.json();
  },

  getDivisionResources: async () => {
    const res = await apiRequest("GET", "/api/reports/division-resources");
    return res.json();
  },

  getConflictsByCasualties: async () => {
    const res = await apiRequest("GET", "/api/reports/conflicts-by-casualties");
    return res.json();
  },

  getGroupsByWeapons: async () => {
    const res = await apiRequest("GET", "/api/reports/groups-by-weapons");
    return res.json();
  },

  getWeaponTrafficking: async () => {
    const res = await apiRequest("GET", "/api/reports/weapon-trafficking");
    return res.json();
  },

  getReligiousConflicts: async () => {
    const res = await apiRequest("GET", "/api/reports/religious-conflicts");
    return res.json();
  },

  // Database Schema
  getDDLSchema: async () => {
    const res = await apiRequest("GET", "/api/schema/ddl");
    return res.json();
  },

  getTriggerInfo: async () => {
    const res = await apiRequest("GET", "/api/triggers");
    return res.json();
  },

  // Custom Queries
  executeQuery: async (query: string) => {
    const res = await apiRequest("POST", "/api/query", { query });
    return res.json();
  },
};
