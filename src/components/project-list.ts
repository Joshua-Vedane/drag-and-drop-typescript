import Component from "./base-component.js";
import { DragTarget } from "../models/drag-drop.js";
import {Project} from "../models/project.js";
import AutoBind from "../decorators/autobind.js";
import { store } from "../state/project-state.js";
import ProjectItem from "./project-item.js";
import { ProjectStatus } from "../models/project.js";

// ProjectList Class
export default class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  @AutoBind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @AutoBind
  dropHandler(event: DragEvent) {
    const projId = event.dataTransfer!.getData("text/plain");
    store.moveProject(
      projId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @AutoBind
  dragLeaveHandler(event: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
    // state listener
    store.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
    this.renderContent();
  }
  private renderProjects() {
    let listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(listEl.id, projectItem);
    }
  }
}