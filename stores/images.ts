import { defineStore } from 'pinia'

export interface IImagesState {
  firstLoad: Boolean,
  images: Array<string>
  terms: string
  page: number
  isLoading: Boolean
}
export const useImages = defineStore('images', {
  state: (): IImagesState => ({
    firstLoad: true,
    images: [],
    terms: "",
    page: 1,
    isLoading: false
  }),
  actions: {
    swap(update: Array<string>, terms: string, page: number) {
      this.images = update
      this.terms = terms;
      this.page = page;
      this.firstLoad = false;
    },
    append(update: Array<string>,page: number){
      this.page = page;
      this.images = [...this.images, ...update];
      this.firstLoad = false;
    },
    loading (bool: Boolean) {
      this.isLoading = bool;
    },
    reset() {
      this.images = []
    },
 
  },
})
