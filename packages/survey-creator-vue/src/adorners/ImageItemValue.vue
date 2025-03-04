<template>
  <div
    @pointerdown="adorner.onPointerDown($event)"
    :class="adorner.getRootCss()"
    :data-sv-drop-target-item-value="adorner.isDraggable ? item.value : null"
    ref="root"
  >
    <div
      class="svc-image-item-value-wrapper__ghost"
      :style="newItemStyle"
    ></div>

    <div class="svc-image-item-value-wrapper__content">
      <input
        type="file"
        aria-hidden="true"
        tabindex="-1"
        :accept="adorner.acceptedTypes"
        class="svc-choose-file-input"
      />

      <template v-if="!adorner.isNew && !adorner.isUploading">
        <div v-if="!adorner.isNew" class="svc-image-item-value__item">
          <component :is="componentName" v-bind="componentData"></component>
        </div>
        <span
          v-if="adorner.isDraggable"
          class="svc-context-button svc-image-item-value-controls__drag-area-indicator"
          @pointerdown="adorner.onPointerDown($event)"
          :title="undefined"
          :aria-label="undefined"
        >
          <sv-svg-icon
            :iconName="'icon-drag-area-indicator'"
            :size="24"
          ></sv-svg-icon>
        </span>
        <div class="svc-context-container svc-image-item-value-controls">
          <span
            class="svc-context-button"
            @click="adorner.chooseFile(adorner)"
            v-key2click
            :title="undefined"
            :aria-label="undefined"
          >
            <sv-svg-icon :iconName="'icon-file'" :size="24"></sv-svg-icon>
          </span>
          <span
            class="svc-context-button svc-context-button--danger"
            @click="adorner.remove(adorner)"
            v-key2click
            :title="undefined"
            :aria-label="undefined"
          >
            <sv-svg-icon :iconName="'icon-delete'" :size="24"></sv-svg-icon>
          </span>
        </div>
      </template>

      <template v-if="adorner.isNew || adorner.isUploading">
        <div
          class="svc-image-item-value__item"
          @dragover="adorner.onDragOver($event)"
          @dragleave="adorner.onDragLeave($event)"
          @drop="adorner.onDrop($event)"
        >
          <div class="sd-imagepicker__item sd-imagepicker__item--inline">
            <label class="sd-imagepicker__label">
              <div :style="newItemStyle" class="sd-imagepicker__image">
                <div
                  class="svc-image-item-value__loading"
                  v-if="adorner.isUploading"
                >
                  <sv-loading-indicator></sv-loading-indicator>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div
          class="svc-image-item-value-controls"
          @pointerdown="(event) => event.stopPropagation()"
        >
          <span
            class="svc-context-button svc-image-item-value-controls__add"
            v-if="adorner.allowAdd && !adorner.isUploading"
            v-key2click
            @click="adorner.chooseNewFile(adorner)"
            :title="undefined"
            :aria-label="undefined"
          >
            <sv-svg-icon :iconName="'icon-add-lg'" :size="24"></sv-svg-icon>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useCreatorModel } from "@/creator-model";
import type { ImageItemValue, QuestionImagePickerModel } from "survey-core";
import {
  CreatorBase,
  ImageItemValueWrapperViewModel,
} from "survey-creator-core";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  componentName: string;
  componentData: {
    data: {
      creator: CreatorBase;
    };
    question: QuestionImagePickerModel;
    item: ImageItemValue;
  };
}>();
const creator = computed(() => props.componentData.data.creator);
const question = computed(() => props.componentData.question);
const item = computed(() => props.componentData.item);
const root = ref<HTMLDivElement>();
const adorner = useCreatorModel(
  () =>
    new ImageItemValueWrapperViewModel(
      creator.value,
      question.value,
      item.value,
      null as any,
      null as any
    ),
  [() => creator.value, () => question.value, () => item.value],
  (value) => {
    value.dispose();
  }
);

const newItemStyle = computed(() => {
  const needStyle = !adorner.value.getIsNewItemSingle();
  return {
    width: needStyle ? question.value.renderedImageWidth + "px" : undefined,
    height: needStyle ? question.value.renderedImageHeight + "px" : undefined,
  };
});

onMounted(() => {
  if (root.value) {
    adorner.value.itemsRoot = root.value;
  }
});
</script>
