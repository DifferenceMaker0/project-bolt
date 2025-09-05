<template>
    <div id="app">
    <h1>Welcome to my Vue App!</h1>
    <router-view></router-view> <!-- If using Vue Router -->
    </div>
    <TheWelcomeItem>
        <template #icon>
            <SupportIcon />
        </template>
        <template #heading>Support</template>

        If you are looking for professional support, you can find a list of
        <a href="https://vuejs.org/support-vuejs/" target="_blank" rel="noopener">Vue partners</a>
        on the official website.
    </TheWelcomeItem> 

</template>

<script>
import TheWelcome from './components/TheWelcome.vue';

export default {
    name: 'App',
    // ... component options
    };
</script>

<style>

</style> 

    