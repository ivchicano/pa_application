import { setLocale } from './i18n'

export default async ({ store, Vue }) => {
    try {
        await store.dispatch('features/fetchFeatures');
        await store.dispatch("language/fetchLanguages")
        await store.dispatch('settings/fetchSettings')
            .then(settings => {
                console.log("#####################################")
                console.log(settings)
                var curlang = settings.filter((setting) => { return setting.key == 'default_language' })[0]
                setLocale(curlang.value)
                var defaultLangString = store.state.language.languages.filter(function (l) { return l.lang == curlang.value })[0].name
                Vue.prototype.$defaultLangString = defaultLangString
                Vue.prototype.$defaultLang = curlang.value
                Vue.prototype.$userLang = curlang.value
            })
    }
    catch (err) {
        console.error('Quasar failed to load data with the error message: ', err)
    }

}

