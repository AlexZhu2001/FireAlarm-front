<script setup>
import { ref } from 'vue';

const emit = defineEmits(['onConditionChanged']);

const trange = ref([
    null,
    null,
]);

const min_temp = ref(null);
const max_temp = ref(null);
const smoke_det = ref(null);
const fire_det = ref(null);
const cleared = ref(null);

const onChangeEmit = () => {
    var start_t = trange.value[0];
    var end_t = trange.value[1];
    var start_t = (start_t === null || start_t === undefined) ? null : start_t.valueOf() / 1000;
    var end_t = (end_t === null || end_t === undefined) ? null : end_t.valueOf() / 1000;
    emit('onConditionChanged', {
        'start_time': start_t,
        'end_time': end_t,
        'min_temp': min_temp.value,
        'max_temp': max_temp.value,
        'smoke_det': smoke_det.value,
        'fire_det': fire_det.value,
        'cleared': cleared.value
    })
};

const onClear = () => {
    trange.value = [
        null,
        null,
    ];
    min_temp.value = null;
    max_temp.value = null;
    smoke_det.value = null;
    fire_det.value = null;
    cleared.value = null;
    onChangeEmit();
};

</script>

<template>
    <el-space wrap :size="15">
        <div>
            <span class="span-title">Time Range:</span>
            <el-date-picker v-model="trange" type="datetimerange" range-separator="To" start-placeholder="Start date"
                end-placeholder="End date" />
        </div>
        <div>
            <span class="span-title">Temperatur Range:</span>
            <el-input-number v-model="min_temp" :precision=2 :step=0.1 :max=250 :min=-40 clearable />
            <span class="span-sep">To</span>
            <el-input-number v-model="max_temp" :precision=2 :step=0.1 :max=250 :min=-40 />
        </div>
        <el-select v-model="smoke_det" placeholder="Smoke?" style="width: 120px" clearable>
            <el-option key="Yes" label="Yes" :value="true" />
            <el-option key="No" label="No" :value="false" />
        </el-select>
        <el-select v-model="fire_det" placeholder="Fire?" style="width: 120px" clearable>
            <el-option key="Yes" label="Yes" :value="true" />
            <el-option key="No" label="No" :value="false" />
        </el-select>
        <el-select v-model="cleared" placeholder="Cleared?" style="width: 120px" clearable>
            <el-option key="Yes" label="Yes" :value="true" />
            <el-option key="No" label="No" :value="false" />
        </el-select>
        <el-button-group>
            <el-button type="success" @click="onChangeEmit">Ok</el-button>
            <el-button type="success" @click="onClear">Clear</el-button>
        </el-button-group>
    </el-space>
</template>

<style scoped>
.span-title {
    margin-left: 2px;
    margin-right: 12px;
    font-size: small;
}

.span-sep {
    margin-left: 12px;
    margin-right: 12px;
    font-size: small;
}

.v-center {
    display: flex;
    align-items: center;
}
</style>