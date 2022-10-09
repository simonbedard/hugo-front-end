<script lang="ts" setup>
import { AppSetup } from './utils/app'
import { ITheme } from './utils/theme'
import { useImages } from '~/stores/images'

AppSetup();

const images = useImages()
const theme = useState<ITheme>('theme.current')
const locale = useState<string>('locale.setting')
const apiConnexion = useState<boolean>('api.connexion')
const nuxtApp = useNuxtApp()


</script>

<template>
  <Html :class="`${theme === 'dark' ? 'dark' : ''}`" :lang="locale">
    <Body
      class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
    >
      <NuxtLayout>
        <NuxtPage @load-more-images="images.loadMore()"/>

          <Alert
            v-if="!apiConnexion.value"
            type="danger"
            title="The connexion with the backend api is broken"
            text="Validate that the backend api is currenlty running on: ${nuxtApp.$config.API_BASE_URL}"
            class="mb-6 fixed bottom-2"
          />


      </NuxtLayout>
    </Body>
  </Html>
</template>


