<template>
    <div>
        <div class="player-count" v-if="connected">
            <span><i class="fa-regular fa-eye"></i>{{ playercount }}</span>
        </div>
        <div class="player-count offline" v-else>
            <span><i class="fa-regular fa-eye-slash"></i>OFFLINE</span>
        </div>
    </div>
</template>

<script setup>
import socketStore from '~/stores/socketStore';

let playercount = ref(0);
let connected = ref(socketStore.connected);

socketStore.socket.on('userCount', (data) => {
    playercount.value = data;
});
</script>

<style scoped>
/* player count */
.player-count {
    position: absolute;
    top: 10px;
    right: 10px;
    backdrop-filter: blur(4.5px);
    border-radius: 7px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background-color: #FF9A8B;
    background-image: linear-gradient(120deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%);
    color: white;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
}

.player-count.offline {
    background-color: #565656 !important;
    background-image: unset;
}
.player-count span {
    font-weight: bold;
    text-align: center;
    font-size: clamp(10px, 5vw, 15px);
}

.player-count span>i {
    margin-right: 10px;
}

@media (max-width: 1024px) {
    .player-count {
        top: 10px;
        right: 10px;
    }
}
</style>