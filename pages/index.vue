<template>
    <div>
        <div class="loadingWrapper" v-if="loading || error || maintenance">
            <div v-if="loading && !error && !maintenance" class="loading">
                <div class="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="loadingText">Loading</div>
            </div>
            <div v-else-if="error" class="error">
                <img src="https://em-content.zobj.net/source/apple/155/warning-sign_26a0.png" alt="">
                <div class="errorText">Unknown error occurred</div>
            </div>
            <div v-else-if="maintenance" class="maintenance">
                <img src="https://emojigraph.org/media/apple/gear_2699-fe0f.png" alt="">
                <p class="maintenanceTitle">We are currently under maintenance</p>
                <p class="maintenanceText" v-if="maintenanceText">{{ maintenanceText }}</p>
            </div>
        </div>
        <Canvas v-if="!loading && !error && !maintenance" />
    </div>
</template>

<script setup>
import canvasStore from '~/stores/canvasStore';

const loading = ref(true);
const error = ref(false);
const maintenance = ref(false);
const maintenanceText = ref("");

const fetchSettings = async () => {
    const res = await $fetch("/api/getSettings");
    if (res && res.status === "success") {
        canvasStore.value.width = res.data[0].canvaswidth;
        canvasStore.value.height = res.data[0].canvasheight;
        canvasStore.value.pixelSize = res.data[0].pixelsize;
        canvasStore.value.maintenance = res.data[0].maintenance;
        canvasStore.value.maintenancetext = res.data[0].maintenancetext;
        if (canvasStore.value.maintenance) {
            maintenance.value = true;
            maintenanceText.value = canvasStore.value.maintenancetext;
            loading.value = false;
        }
    } else {
        error.value = true;
    }
}

const fetchGrid = async () => {
    const gridRes = await $fetch("/api/getGrid");
    if (gridRes && gridRes.status === "success") {
        canvasStore.value.data = gridRes.data;
        loading.value = false;
    } else {
        error.value = true;
    }
    return;
}

onMounted(async () => {
    try {
        await fetchSettings();
        if (!canvasStore.value.maintenance) {
            setInterval(async () => {
                await fetchGrid();
            }, 3000);
        }
    } catch (err) {
        error.value = true;
    }
});
</script>


<style scoped>
p {
    margin: 0;
}

.loadingWrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

/* error */
.error {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.error img {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
}

.errorText {
    font-size: clamp(16px, 5vw, 24px);
}

/* maintenance */
.maintenance {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.maintenance img {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
}

.maintenanceTitle {
    font-size: clamp(16px, 5vw, 24px);
}

.maintenanceText {
    font-size: clamp(10px, 5vw, 16px);
    width: 600px;
    height: 200px;
    white-space: normal;
    overflow: auto;
    background: rgba(255, 255, 255, 0.058);
    border-radius: 7px;
    margin-top: 30px;
    padding: 10px 15px;
    font-family: monospace;
}

/* loading */
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.lds-spinner {
    color: official;
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 30px;
}

.lds-spinner div {
    transform-origin: 40px 40px;
    animation: lds-spinner 1.2s linear infinite;
}

.lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 37px;
    width: 6px;
    height: 18px;
    border-radius: 20%;
    background: #fff;
}

.lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
}

.lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
}

.lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
}

.lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
}

.lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
}

.lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
}

.lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
}

.lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
}

.lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
}

.lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
}

.lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
}

.lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
}

@keyframes lds-spinner {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}</style>
