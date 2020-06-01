import * as ko from "knockout";

import * as Survey from "survey-knockout";

import { SurveyHelper, ObjType } from "../surveyHelper";
import { SurveyCreator } from "../editor";
import { editorLocalization } from "../editorLocalization";

import "./pages-editor.scss";
import { PagesEditorModel } from "../pages-editor-model";

var template = require("html-loader?interpolate!val-loader!./pages-editor.html");

export class PagesEditor extends PagesEditorModel {
  constructor(creator: SurveyCreator, private element: any) {
    super(creator);
    if (!!this.element && typeof this.element.querySelector === "function") {
      this.updateScroller = setInterval(() => {
        var pagesElement: HTMLDivElement = this.element.querySelector(
          ".svd-pages"
        );
        if (!!pagesElement) {
          this.hasScroller(pagesElement.scrollWidth > pagesElement.offsetWidth);
        }
      }, 100);
    }
  }

  public get creatorInstance() {
    return this.creator;
  }

  moveLeft(model, event) {
    var pagesElement = this.element.querySelector(".svd-pages");
    pagesElement.scrollLeft -= 50;
    this.updateMenuPosition();
  }
  moveRight(model, event) {
    var pagesElement = this.element.querySelector(".svd-pages");
    pagesElement.scrollLeft += 50;
    this.updateMenuPosition();
  }
  scrollToSelectedPage() {
    var pagesElement: any = this.element.querySelector(".svd-pages");
    if (!pagesElement) return;
    var index = this.pages.indexOf(this.selectedPage);
    var pageElement = pagesElement.children[index];
    if (!pageElement) return;
    pagesElement.scrollLeft =
      pageElement.offsetLeft -
      pagesElement.offsetLeft -
      pagesElement.offsetWidth / 2;
    this.updateMenuPosition();
  }

  onWheel(model, event) {
    var pagesElement = model.element.querySelector(".svd-pages");
    event = event || window.event;
    if (!!event.originalEvent) {
      event = event.originalEvent;
    }
    var delta = event.deltaY || event.detail || event.wheelDelta;
    pagesElement.scrollLeft -= delta;
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    this.updateMenuPosition();
  }
  updateMenuPosition() {
    var pagesElement = this.element.querySelector(".svd-pages");
    var menuElements = pagesElement.getElementsByClassName("svd-page-actions");
    for (var i = 0; i < menuElements.length; i++) {
      menuElements[i].style.left =
        menuElements[i].parentElement.offsetLeft -
        pagesElement.scrollLeft +
        "px";
    }
  }

  onPageClick = (model, event) => {
    this.isNeedAutoScroll = false;
    this.creator.selectPage(model);
    event.stopPropagation();
    this.updateMenuPosition();
  };
}

ko.components.register("svd-pages-editor", {
  viewModel: {
    createViewModel: (params, componentInfo) => {
      return new PagesEditor(params.editor, componentInfo.element);
    },
  },
  template: template,
});
