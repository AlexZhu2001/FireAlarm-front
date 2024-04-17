<script lang="js" setup>
import { ref } from 'vue';

defineProps(['tableData']);
const emit = defineEmits(['onMarkDelete', 'onMarkClear']);

const tableRef = ref(null);
const multipleSelection = ref([]);
const hasSelection = ref(false);
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
    hasSelection.value = (val.length != 0);
};
const deleteDlgVisible = ref(false);
const clearDlgVisible = ref(false);

const dateToStr = (date) => {
    var date = new Date(date);
    return date.toLocaleString();
}

const clearSelections = () => {
    tableRef.value.clearSelection();
};

const getHeadStyle = (data) => {
    if (data.columnIndex == 4 || data.columnIndex == 5 || data.columnIndex == 6) {
        return { 'text-align': 'center' };
    }
    return { 'text-align': 'left' };
};

const markClear = () => {
    var ids = multipleSelection.value.map((x) => {
        return x.id;
    });
    emit('onMarkClear', ids);
    clearDlgVisible.value = false;
}

const markDelete = () => {
    var ids = multipleSelection.value.map((x) => {
        return x.id;
    });
    emit('onMarkDelete', ids);
    deleteDlgVisible.value = false;
}
</script>

<template>
    <el-table ref="tableRef" :data="tableData" style="width: 100%; height: 600px;" stripe
        :header-cell-style="getHeadStyle" @selection-change="handleSelectionChange">

        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="100" sortable />
        <el-table-column prop="timestamp" label="DateTime" width="190" sortable>
            <template #default="scope">
                <div>
                    <span>{{ dateToStr(scope.row.timestamp) }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="temperature" label="Temperature" width="140" sortable>
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <el-icon>
                        <Odometer />
                    </el-icon>
                    <span>{{ scope.row.temperature }}°C</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="smoke_detected" label="Smoke Detected?">
            <template #default="scope">
                <div class="vh-center">
                    <el-icon>
                        <Select v-if="scope.row.smoke_detected" />
                        <CloseBold v-else />
                    </el-icon>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="fire_detected" label="Fire Detected?">
            <template #default="scope">
                <div class="vh-center">
                    <el-icon>
                        <Select v-if="scope.row.fire_detected" />
                        <CloseBold v-else />
                    </el-icon>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="cleared" label="Cleared?">
            <template #default="scope">
                <div class="vh-center">
                    <el-icon>
                        <Select v-if="scope.row.cleared" />
                        <CloseBold v-else />
                    </el-icon>
                </div>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="130">
            <template #default="scope">
                <el-button link type="primary" size="small" :disabled="scope.row.cleared"
                    @click="$emit('onMarkClear', [scope.row.id])">Clear</el-button>
                <el-button link type="danger" size="small" @click="$emit('onMarkDelete', [scope.row.id])">Delete</el-button>
            </template>
        </el-table-column>
    </el-table>
    <transition name="fade">
        <div v-show="hasSelection">
            <br />
            <el-space>
                <el-button type="primary" @click="clearSelections">Clear
                    selections</el-button>
                <el-button type="primary" @click="clearDlgVisible = true">Make all cleared</el-button>
                <el-button type="danger" @click="deleteDlgVisible = true">Delete all</el-button>
            </el-space>
        </div>
    </transition>
    <el-dialog v-model="deleteDlgVisible" title="Confirm" width="500" :show-close="false">
        <span>Confirm delete all selections?</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteDlgVisible = false">Cancel</el-button>
                <el-button type="primary" @click="markDelete">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="clearDlgVisible" title="Confirm" width="500" :show-close="false">
        <span>Confirm mark all selections cleared?</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="clearDlgVisible = false">Cancel</el-button>
                <el-button type="primary" @click="markClear">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.vh-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 定义过渡效果 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
