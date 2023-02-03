<script>
import LayoutHeader from './LayoutHeader.vue';

export default {
    name: 'Layout',
    components: {
        LayoutHeader,
    },
    props: ['className'],
}

</script>

<template>
    <main class="layout" :class="className">
        <section class="layout__content">
            <slot></slot>
        </section>
    </main>
</template>

<style lang="scss">
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    &__header {
    }

    &__content {
        box-sizing: border-box;
        width: 100%;
        margin-inline: auto;
        flex: 1;
    }

}
</style>
