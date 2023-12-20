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
        <div v-if="!loading && !error && !maintenance">
            <div class="popup" v-if="popup">
                <div class="content">
                    <p class="title">Welcome to <b>Absolutely Ethical and Family Friendly Canvas</b></p>
                    <span>
                        <b>Rules: </b>There are no rules.<br><br>
                        Please note that this website is in beta and you may find bugs and instability.
                    </span>
                    <button @click="popup = false"><i class="fa-solid fa-check"></i></button>
                </div>
            </div>
            <Canvas />
        </div>
    </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
import canvasStore from '~/stores/canvasStore';

const loading = ref(true);
const error = ref(false);
const maintenance = ref(false);
const maintenanceText = ref("");
const popup = ref(true);

const fetchSettings = async () => {
    const res = await $fetch(`${runtimeConfig.public.apiBase}/api/getSettings`);
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
        await fetchGrid();
    } else {
        error.value = true;
    }
}

const fetchGrid = async () => {
    const gridRes = await $fetch(`${runtimeConfig.public.apiBase}/api/getGrid`);
    if (gridRes && gridRes.status === "success") {
        canvasStore.value.data = gridRes.data;
        loading.value = false;
    } else {
        error.value = true;
    }
}

onMounted(async () => {
    try {
        await fetchSettings();
        if (!canvasStore.value.maintenance) {
            fetchGrid();
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
    background: #1f1f1f;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

/* popup */
.popup {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    width: 350px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(8px);
}

.popup .content {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 7px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4.5px);
    padding: 15px;
    margin: 10px;
}

.popup .title {
    font-size: 20px;
    margin-bottom: 10px;
}

.popup span {
    font-size: 14px;
    opacity: 0.8;
}

.popup button {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 25px;
    border: none;
    background: #dcff42;
    color: black;
    outline: none;
    cursor: pointer !important;
    z-index: 999;
    margin-top: 15px;
}

.popup button:hover {
    opacity: 0.8;
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
}
</style>
