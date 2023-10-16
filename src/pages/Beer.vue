<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <h1 class="text-3xl font-bold underline text-center my-3">Beer</h1>
            </el-header>
            <el-main>
                <el-skeleton style="width: 100%" :loading="loading" animated>
                    <template #template>
                        <el-skeleton-item variant="rect" style="width: 920px; height: 680px" />
                    </template>
                    <template #default>
                        <el-table :data="beerData" style="width: 100%" height="680">
                            <el-table-column fixed prop="name" label="Name" width="120" />
                            <el-table-column prop="first_brewed" label="First Brewed" width="120" />
                            <el-table-column label="Image" width="110">
                                <template #default="{ row }">
                                    <img :src="row.image_url">
                                </template>
                            </el-table-column>
                            <el-table-column prop="attenuation_level" label="Attenuation Level" width="110" />
                            <el-table-column label="Info">
                                <el-table-column label="Boil Volume">
                                    <el-table-column prop="boil_volume.unit" label="Unit" width="70" />
                                    <el-table-column prop="boil_volume.value" label="Value" width="70" />
                                </el-table-column>
                                <el-table-column label="Volume">
                                    <el-table-column prop="volume.unit" label="Unit" width="70" />
                                    <el-table-column prop="volume.value" label="Value" width="70" />
                                </el-table-column>
                                <el-table-column prop="description" label="Description" width="300" />
                                <el-table-column prop="tagline" label="Tagline" width="120" />
                                <el-table-column label="Operations" width="180">
                                    <template #default="{ row }">
                                        <div class="flex">
                                            <el-button type="warning" @click="form = row,
                                                dialogUpdate = true">
                                                Edit
                                            </el-button>
                                            <el-button type="danger" @click="onDelete(row.id)">Delete</el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-skeleton>
            </el-main>
        </el-container>
    </div>

    <el-dialog v-model="dialogUpdate" title="Beer Info" draggable align-center>
        <el-form :model="form">
            <el-form-item label="Name" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Description" :label-width="formLabelWidth">
                <el-input v-model="form.description" autocomplete="off" type="textarea" rows="6" />
            </el-form-item>
            <el-divider content-position="left">Volume</el-divider>
            <el-form-item label="Unit" :label-width="formLabelWidth">
                <el-input v-model="form.boil_volume.unit" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Value" :label-width="formLabelWidth">
                <el-input v-model="form.boil_volume.value" autocomplete="off" />
            </el-form-item>
            <el-divider content-position="left">Boil Volume</el-divider>
            <el-form-item label="Unit" :label-width="formLabelWidth">
                <el-input v-model="form.volume.unit" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Value" :label-width="formLabelWidth">
                <el-input v-model="form.volume.value" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogUpdate = false">Cancel</el-button>
                <el-button type="primary" @click="onUpdate(form)">Update</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogDelete" title="Warning" width="30%" align-center>
        <span>
            It should be noted that the content will not be aligned in center by
            default
        </span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="deleteCancel('user cancel'), dialogDelete = false">Cancel</el-button>
                <el-button type="primary" @click="deleteConfirm('user confirm'), dialogDelete = false">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import axios from "axios";
import { ElNotification, ElLoading } from "element-plus";

interface Beer {
    id: number,
    name: string,
    tagline: string,
    first_brewed: string,
    description: string,
    image_url: string,
    abv: number,
    ibu: number,
    target_fg: number,
    target_og: number,
    ebc: number,
    srm: number,
    ph: number,
    attenuation_level: number,
    volume: {
        unit: string,
        value: string,
    },
    boil_volume: {
        unit: string,
        value: string,
    },
}

const loading = ref<boolean>(true);
const beerData = ref<Beer[]>([]);
onMounted(async () => {
    const { data } = await axios.get("http://localhost:8888/beer/query");
    beerData.value = data;
    loading.value = false;
});

const dialogUpdate = ref<boolean>(false);
const formLabelWidth: string = '100px';
const form = reactive<Beer>({
    id: NaN,
    name: "",
    tagline: "",
    first_brewed: "",
    description: "",
    image_url: "",
    abv: NaN,
    ibu: NaN,
    target_fg: NaN,
    target_og: NaN,
    ebc: NaN,
    srm: NaN,
    ph: NaN,
    attenuation_level: NaN,
    volume: {
        unit: "",
        value: "",
    },
    boil_volume: {
        unit: "",
        value: "",
    },
});
const onUpdate: (beerItem: Beer) => void = async (beerItem: Beer): Promise<void> => {
    const loadingInstance = ElLoading.service({ fullscreen: true, background: "#000a" });
    const { data } = await axios.post("http://localhost:8888/beer/update", beerItem);
    const beerIndex = beerData.value.indexOf(beerItem);
    beerData.value[beerIndex] = data;
    loadingInstance.close();
    dialogUpdate.value = false;
    ElNotification({
        title: "Update Success",
        message: `${beerItem.name} was updated`,
        type: "success",
    });
}

const dialogDelete = ref<boolean>(false);
const deleteConfirm = ref();
const deleteCancel = ref();
const onDelete: (beerId: number) => void = async (beerId: number): Promise<void> => {
    dialogDelete.value = true;

    const deletePromise: any = new Promise<any>((resolve, reject) => {
        deleteConfirm.value = resolve;
        deleteCancel.value = reject;
    })
        .then(trigger => ({ trigger, result: true }))
        .catch(reason => {
            console.error(reason);
            return { reason, result: false };
        });

    const { result } = await deletePromise;
    if (result) {
        const { data } = await axios.post(`http://localhost:8888/beer/delete/${beerId}`);
        console.log(data);

    }
}
</script>