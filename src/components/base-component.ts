// Component Base Class
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  appEl: T;
  element: U;

  constructor(
    templateId: string,
    appElId: string,
    afterBegin: boolean,
    newElId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.appEl = document.getElementById(appElId)! as T;
    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElId) {
      this.element.id = newElId;
    }
    this.attach(afterBegin);
  }

  private attach(afterBegin: boolean) {
    this.appEl.insertAdjacentElement(
      afterBegin ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}