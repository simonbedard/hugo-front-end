import { defineStore } from 'pinia';

export interface IImageState {
  image: any
}

export const useImage = defineStore('image', {

  state: (): IImageState => ({
    image: null,
  }),

  getters: {
  },
  actions: {
    update (image: any) {
      this.image = image;
    },
  },
})
