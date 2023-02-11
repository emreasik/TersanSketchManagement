<template>
    <div ref="drawModeSettings" class="draw-line-settings-bar" :class="{'draw-mode':isVisible}">
        <button class="draw-line-settings-bar__button draw-line-settings-bar__button-cross" @click="$emit('resetDrawLine')" value="asdas">
            <img class="p-0 m-0 w-50 draw-line-settings-bar__button__image" :src='cross' alt="cross" />
        </button>
        <button class="draw-line-settings-bar__button draw-line-settings-bar__button-save" value="asdas">
            <img class="p-0 m-0 w-50 draw-line-settings-bar__button__image" :src='save' alt="cross" />
        </button>
    </div>
</template>

<script>

import cross from '../../../../assets/icons/cross.png';
import save from '../../../../assets/icons/save.png';
export default {
    data() {
        return {
            cross,
            save
        };
    },
    props: {
        isVisible: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="scss">
@use '../../../../assets/variables.scss' as v;

    .draw-line-settings-bar {
        background-color: v.$tersan-main-color;
        z-index: 100;
        position: fixed;
        top: 5%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: -1px 1px 5px 0px rgba(20, 77, 129, 1);
        border-radius: 15px;
        margin: 0;
        padding: 0;
        height: 50px;
        opacity: 0;
        transition: opacity 0.2s;
        overflow: hidden;

        &__button {
            background-color: transparent;
            outline: none;
            border: 0;
            padding: 0.5rem;
            height: 100%;

            &:hover {
                background-color: rgb(9, 61, 109);
            }         
            
            &-cross {
                border-radius: 15px 0 0 15px;
            }
            &-save {
                border-radius: 0 15px 15px 0;
            }
        }
      
    }
    .draw-mode {
            opacity: 1 !important;
        }

</style>