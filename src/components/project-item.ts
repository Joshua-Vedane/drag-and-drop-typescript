import Component from "./base-component.js";
import { Draggable } from "../models/drag-drop.js";
import {Project} from "../models/project.js";
import AutoBind from "../decorators/autobind.js";

//ProjectItem Class
export default class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get peopleCase(): string {
    if (this.project.people === 1) {
      return "1 Person";
    } else {
      return `${this.project.people} Persons`;
    }
  }

  constructor(listId: string, project: Project) {
    super("single-project", listId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @AutoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @AutoBind
  dragEndHandler(event: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector(
      "h3"
    )!.textContent = `${this.peopleCase} assigned`;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}