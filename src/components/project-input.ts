import Component from "./base-component.js";
import { Validatable, validator } from "../util/validation.js";
import AutoBind from "../decorators/autobind.js";
import { store } from "../state/project-state.js";

// store and display input values
export default class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    // access to the inputs in the form and store them as properties of the class
    this.titleInputEl = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  public configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  private fetchUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 5,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    /// validate the inputs
    if (
      !validator(titleValidatable) ||
      !validator(descriptionValidatable) ||
      !validator(peopleValidatable)
    ) {
      alert("Invalid input, please try again.");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearFields() {
    this.titleInputEl.value = "";
    this.descriptionInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.fetchUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      // console.log(userInput);
      store.addProject(title, desc, people);
      this.clearFields();
    }
  }
}