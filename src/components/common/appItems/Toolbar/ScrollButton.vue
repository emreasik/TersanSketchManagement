<template>
  <div class="scroll-button__sketch-container">
            <div>
                <LeftArrow id="left-arrow" class="base-arrow" @mouseenter="$emit('scrollScreen',direction.left)" @mouseleave="$emit('stopScrollScreen')" />
                <UpArrow id="up-arrow" class="base-arrow" @mouseenter="$emit('scrollScreen',direction.up)" @mouseleave="$emit('stopScrollScreen')" />
                <RightArrow id="right-arrow" class="base-arrow" @mouseenter="$emit('scrollScreen',direction.right)" @mouseleave="$emit('stopScrollScreen')" />
                <DownArrow id="down-arrow" class="base-arrow" @mouseenter="$emit('scrollScreen',direction.down)" @mouseleave="$emit('stopScrollScreen')" />
                <Dot id="dot" class="base-arrow" @mouseenter="$emit('scrollScreen',direction.dot)" @mouseleave="$emit('stopScrollScreen')" />
            </div>
    </div>
</template>

<script>
import Dot from '../../../../assets/icons/Dot.vue';
import LeftArrow from '../../../../assets/icons/leftArrow.vue';
import RightArrow from '../../../../assets/icons/rightArrow.vue';
import UpArrow from '../../../../assets/icons/upArrow.vue';
import DownArrow from '../../../../assets/icons/downArrow.vue';

export default {
    name: 'ScrollButton',
    components: {
        Dot,
        LeftArrow,
        RightArrow,
        UpArrow,
        DownArrow
    },
    data() {
        return {
            direction:{
                left: 'left',
                right: 'right',
                up: 'up',
                down: 'down',
                dot: 'dot'
            }
        }
    },
}
</script>


<style lang="scss">
@use '../../../../assets/_variables.scss' as v;
.scroll-button__sketch-container {
    background-color: v.$tersan-main-color;
        z-index: 100;
        position: fixed;
        top: 98%;
        left: 98%;
        transform: translate(-90%, -96%);
        box-shadow: -1px 1px 5px 0px rgba(20, 77, 129, 1);
        border-radius: 50%;
        margin: 0;
        padding: 0;
        height: 100px;
        width: 100px;
        transition: opacity 0.2s;
        overflow: hidden;

}

#left-arrow {
    position: absolute;
    top: 50%;
    left: 20%;
}

.base-arrow{
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    transition: all 0.2s ease-in-out;
    &:hover {
        width: 50px !important;
        height: 50px !important;

    }

    &#up-arrow {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
}

    &#right-arrow {
        position: absolute;
        top: 50%;
        left: 80%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
    }

    &#down-arrow {
        position: absolute;
        top: 80%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
    }

    &#dot {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
    }
}




</style>