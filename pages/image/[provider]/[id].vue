<script lang="ts" setup>
  import { useImage } from '~/stores/image'

const route = useRoute()
const image = useImage();
const nuxtApp = useNuxtApp()


onBeforeMount(async () => {
    if(image.image == null){
        const Url = `${nuxtApp.$config.API_BASE_URL}search/file/${route.params.provider}/${route.params.id}`;
        const response = await fetch(Url)
        if (response.status !== 200)
            throw new Error(`error when fetching IMAGES : Start loading from API`)
        const data = (await response.json());
        image.update(data.DATA.image);
    }   
});


definePageMeta({
    layout: 'page',
})



</script>

<template>
    <PageWrapper class="max-w-screen-lg mx-8 m-auto flex flex-col justify-center items-center">
        <PageHeader v-if="image.image">
            <PageTitle :text="image.image.title" class="capitalize"  />
        </PageHeader>
        <PageBody>
            <div v-if="image.image">
                <img :src="image.image.src.thumbnail" :alt="image.image.src.alt">
                <p>{{ image.image.created_at }}</p>
                <p>{{ image.image.provider.name }}</p>
                <!-- <p>{{ image.image.src.size.width }}px - {{ image.image.src.size.height }}px </p>
                <a :href="image.image.infos.user.links.provider_profile"> 
                    <img :src="image.image.infos.user.profile_image" :alt="image.image.provider.name">
                    {{ image.image.infos.user.name }}
                </a>
                <ul v-for="exif in image.image.infos.exif" :key="exif">
                    <li>{{ exif }}</li>
                </ul> -->
            </div>
        </PageBody>
    </PageWrapper>

</template>



<style>

</style>