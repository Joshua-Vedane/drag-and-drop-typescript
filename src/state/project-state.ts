import {Project, ProjectStatus } from "../models/project.js";


// State Management
type Listener = (items: Project[]) => void;

export class StateStore {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: StateStore;
  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new StateStore();
      return this.instance;
    }
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, desc: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      people,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    // when something changes, call the listeners
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
export const store = StateStore.getInstance();