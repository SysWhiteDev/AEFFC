<template>
    <div class="wrapper" ref="wrapper">
        <canvas ref="canvas" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup.left="handleMouseUp"
            @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
            :style="`transform: scale(${zoom}) translateX(${this.zoompos ? this.zoompos.x : 0}px) translateY(${this.zoompos ? this.zoompos.y : 0}px);`"></canvas>
        <playerCount />
        <!-- <div class="timer">
            <span>3.42s</span>
        </div> -->
        <div class="color-picker" v-if="socketStore.connected">
            <div class="selected" :style="`background: #${selectedData.color};`" />
            <div class="colors">
                <div class="row">
                    <div class="color dark" @click="setColor(`000000`)" :style="`background: #000000;`"
                        :class="{ 'active': this.selectedData.color === '000000' }" />
                    <div class="color dark" @click="setColor(`e90000`)" :style="`background: #e90000;`"
                        :class="{ 'active': this.selectedData.color === 'e90000' }" />
                    <div class="color light" @click="setColor(`ffa7d2`)" :style="`background: #ffa7d2;`"
                        :class="{ 'active': this.selectedData.color === 'ffa7d2' }" />
                    <div class="color light" @click="setColor(`e5e5e5`)" :style="`background: #e5e5e5;`"
                        :class="{ 'active': this.selectedData.color === 'e5e5e5' }" />
                    <div class="color dark" @click="setColor(`89888a`)" :style="`background: #89888a;`"
                        :class="{ 'active': this.selectedData.color === '89888a' }" />
                    <div class="color light" @click="setColor(`e89800`)" :style="`background: #e89800;`"
                        :class="{ 'active': this.selectedData.color === 'e89800' }" />
                    <div class="color light" @click="setColor(`e7dc00`)" :style="`background: #e7dc00;`"
                        :class="{ 'active': this.selectedData.color === 'e7dc00' }" />
                    <div class="color light" @click="setColor(`ffffff`)" :style="`background: #ffffff;`"
                        :class="{ 'active': this.selectedData.color === 'ffffff' }" />
                </div>
                <div class="row">
                    <div class="color dark" @click="setColor(`00c100`)" :style="`background: #00c100;`"
                        :class="{ 'active': this.selectedData.color === '00c100' }" />
                    <div class="color light" @click="setColor(`00e6f2`)" :style="`background: #00e6f2;`"
                        :class="{ 'active': this.selectedData.color === '00e6f2' }" />
                    <div class="color dark" @click="setColor(`0083cb`)" :style="`background: #0083cb;`"
                        :class="{ 'active': this.selectedData.color === '0083cb' }" />
                    <div class="color light" @click="setColor(`93e330`)" :style="`background: #93e330;`"
                        :class="{ 'active': this.selectedData.color === '93e330' }" />
                    <div class="color dark" @click="setColor(`0100ef`)" :style="`background: #0100ef;`"
                        :class="{ 'active': this.selectedData.color === '0100ef' }" />
                    <div class="color dark" @click="setColor(`e33cff`)" :style="`background: #e33cff;`"
                        :class="{ 'active': this.selectedData.color === 'e33cff' }" />
                    <div class="color dark" @click="setColor(`830082`)" :style="`background: #830082;`"
                        :class="{ 'active': this.selectedData.color === '830082' }" />
                </div>
            </div>
        </div>
        <div class="zoom-controls">
            <button @click="zoomCanvas(0.05)">+</button>
            <button @click="zoomCanvas(-0.05)">-</button>
        </div>
    </div>
</template>
  
<script>
import canvasStore from '~/stores/canvasStore.ts';
import socketStore from '~/stores/socketStore';
export default {
    data() {
        return {
            canvasStore: canvasStore,
            socketStore: socketStore,
            pixelSize: 10,
            zoom: 0.35,
            dragStart: {},
            dragEnd: {},
            zoompos: {
                x: 0,
                y: 0,
            },
            selectedData: {
                color: '000000',
            },
            playercount: 0,
            socket: socketStore.socket,
        };
    },
    mounted() {
        this.$refs.wrapper.addEventListener('wheel', this.handleWheel);
        window.addEventListener('mouseup', this.handleMouseUpOutside);
        this.createCanvas();
        this.socket
            .on('getPlace', (data, cb) => {
                const canvas = this.$refs.canvas;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.fillStyle = '#' + data.color;
                ctx.fillRect(data.x, data.y, this.pixelSize, this.pixelSize);
            });
    },
    methods: {
        handleMouseUpOutside() {
            if (this.isDragging) {
                this.isDragging = false;
                document.body.style.cursor = 'default';
                this.$refs.canvas.style.cursor = 'default';
                this.$refs.wrapper.style.cursor = 'default';
            }
        },
        createCanvas() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            canvas.width = this.canvasStore.width;
            canvas.height = this.canvasStore.height;

            for (let y = 0; y < canvas.height; y += this.pixelSize) {
                for (let x = 0; x < canvas.width; x += this.pixelSize) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
                }
            }
            for (let key in canvasStore.value.data) {
                let coordinates = key.split(',').map(Number);
                let color = canvasStore.value.data[key];
                ctx.fillStyle = '#' + color;
                ctx.fillRect(coordinates[0], coordinates[1], this.pixelSize, this.pixelSize);
            }
        },
        handleWheel(event) {
            if (event.target === this.$refs.wrapper || event.target === this.$refs.canvas) {
                this.zoomCanvas(- (event.deltaY / 1000))
            };
        },
        zoomCanvas(amount) {
            if (this.zoom + amount > 0.05 && this.zoom + amount < 5) {
                this.zoom += amount * 2;
            }
        },
        async handlePlace(event) {
            if (socketStore.connected.value) {
                const canvas = this.$refs.canvas;
                const ctx = canvas.getContext('2d');

                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;

                const pixelX = Math.floor((event.clientX - rect.left) * scaleX / this.pixelSize);
                const pixelY = Math.floor((event.clientY - rect.top) * scaleY / this.pixelSize);

                const pixelData = ctx.getImageData(pixelX * this.pixelSize, pixelY * this.pixelSize, 1, 1).data;

                if (pixelData[3] !== 0 || pixelData[3] !== 255) {
                    canvasStore.value.localData.push({
                        x: pixelX * this.pixelSize,
                        y: pixelY * this.pixelSize,
                        color: this.selectedData.color,
                    });
                    ctx.fillStyle = `#${this.selectedData.color}`;
                    ctx.fillRect(pixelX * this.pixelSize, pixelY * this.pixelSize, this.pixelSize, this.pixelSize);
                    this.socket.emit('setPlace', {
                        x: pixelX * this.pixelSize,
                        y: pixelY * this.pixelSize,
                        color: this.selectedData.color,
                    })
                }
            };
        },
        handleMouseDown(event) {
            this.dragStart = { x: event.clientX, y: event.clientY };
            this.zoomposStart = { x: this.zoompos.x, y: this.zoompos.y };
            this.isDragging = true;
        },
        handleMouseMove(event) {
            if (this.isDragging && event.buttons == 1) {
                this.handlePlace(event);
            }
            if (this.isDragging && event.buttons == 4) {
                document.body.style.cursor = 'grabbing';
                this.$refs.canvas.style.cursor = 'grabbing';
                this.$refs.wrapper.style.cursor = 'grabbing';
                const deltaMoveX = (event.clientX - this.dragStart.x) / this.zoom;
                const deltaMoveY = (event.clientY - this.dragStart.y) / this.zoom;

                this.zoompos.x += deltaMoveX;
                this.zoompos.y += deltaMoveY;

                this.dragStart = { x: event.clientX, y: event.clientY };
            }
        },
        handleMouseUp(event) {
            this.dragEnd = { x: this.zoompos.x, y: this.zoompos.y };
            if (Math.sqrt(Math.abs((this.zoomposStart.x - this.dragEnd.x) + (this.zoomposStart.y - this.dragEnd.y))) < 1.5) {
                this.handlePlace(event);
            } else {
                this.isDragging = false;
                document.body.style.cursor = 'default';
                this.$refs.canvas.style.cursor = 'default';
                this.$refs.wrapper.style.cursor = 'default';
            }
        },
        handleTouchStart(event) {
            this.isTouching = true;
            this.touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            if (this.isTouching && event.touches.length === 2) {
                const distance = Math.sqrt(Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) + Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2));
                this.initialDistance = distance;
                this.initialZoom = this.zoom;
            }
        },
        handleTouchMove(event) {
            if (this.isTouching && event.touches.length === 1) {
                this.handlePlace(event.touches[0]);
            }
            if (this.isTouching && event.touches.length === 2) {
                // zoom
                const distance = Math.sqrt(Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) + Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2));
                const amount = (distance - this.initialDistance) / 800;
                if (this.zoom + (this.initialZoom + amount) > 0.15 && this.zoom + (this.initialZoom + amount) < 5) {
                    this.zoom = this.initialZoom + amount;
                }

                // movement
                const deltaX = (event.touches[0].clientX - this.touchStart.x) / this.zoom;
                const deltaY = (event.touches[0].clientY - this.touchStart.y) / this.zoom;

                this.zoompos.x += deltaX;
                this.zoompos.y += deltaY;

                this.touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            }
        },
        handleTouchEnd() {
            this.isTouching = false;
        },
        setColor(color) {
            this.selectedData.color = color;
        },
    },
    beforeDestroy() {
        this.$refs.scrollDiv.removeEventListener('wheel', this.handleWheel)
    }
};
</script>
  
<style scoped>
.wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    width: 100dvw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0;
}


/* - timer */
.timer {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: rgb(255, 255, 255, 0.8);
    backdrop-filter: blur(4.5px);
    border-radius: 7px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 13px 15px;
    position: absolute;
    bottom: 10px;
    left: 10px;
}

.timer span {
    /* font-weight: bold; */
    text-align: center;
    font-size: clamp(25px, 5vw, 40px);
}

@media (max-width: 1024px) {
    .timer {
        bottom: unset;
        top: 10px;
    }
}

/* - color picker */
.color-picker {
    background: rgb(255, 255, 255, 0.8);
    backdrop-filter: blur(4.5px);
    border-radius: 7px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 13px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 350px;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    bottom: 10px;
}

.color-picker>.selected {
    width: 60px;
    height: 60px;
    border-radius: 7px;
    flex-shrink: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.color-picker>.colors {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    margin-left: 15px;
    flex-direction: column;
}

.color-picker>.colors>.row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
}

.color-picker>.colors>.row:not(:last-child) {
    margin-bottom: 10px;
}

.color-picker>.colors>.row>.color {
    width: 25px;
    height: 25px;
    border-radius: 7px;
    background: red;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease-in-out;
    margin-right: 10px;
    position: relative;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.color-picker>.colors>.row>.color.active::before {
    content: "✔";
    position: absolute;
    color: rgb(0, 0, 0);
    /* border: 2px rgb(255, 255, 255) solid; */
    font-size: 0.8rem;
    font-weight: bold;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
}

.color-picker>.colors>.row>.color.light.active::before {
    color: black;
}

.color-picker>.colors>.row>.color.dark.active::before {
    color: #ffffff;
}

@media (max-width: 1024px) {
    .color-picker {
        flex-direction: column;
        justify-content: center;
        width: auto;
        left: 10px;
        bottom: 10px;
        right: unset;
        top: unset;
        padding: 5px;
    }

    .color-picker>.colors {
        flex-direction: row;
        align-items: flex-start;
        margin: 0;
        margin-top: 10px;
    }

    .color-picker>.colors>.row {
        flex-direction: column;
        margin: 0 !important;
    }

    .color-picker>.colors>.row:not(:last-child) {
        margin-right: 4px !important;
    }

    .color-picker>.colors>.row>.color {
        margin: 0;
        margin-bottom: 4px;
    }
}

/* - zoom controls */
.zoom-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 7px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4.5px);
    position: absolute;
    bottom: 10px;
    text-align: center;
    right: 10px;
}

.zoom-controls button {
    width: 40px;
    height: 40px;
    border: none;
    background: none;
    font-size: 1.5rem;
    cursor: pointer;
    outline: none;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: black;
}

.zoom-controls button:hover {
    opacity: 0.8;
    background: #00000010;
}

@media (max-width: 1024px) {
    .zoom-controls {
        bottom: 10px;
        right: 10px;
        left: unset;
    }
}

/* canvas */
canvas {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 7px;
    transition: all 0.2 ease-in-out;
    touch-action: none;
}
</style>
  