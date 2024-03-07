<template>
  <main class="p-4 md:ml-64 h-auto pt-20">
    <VehicleAddDialog v-model:visible="addDialogVisible"
                      v-model:vehicle-model-items="vehicleModelItems"
                      @confirm="onConfirmAdd"/>
    <Toolbar class="mb-4">
      <template #start>
        <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="addNew"/>
      </template>

      <template #end>
        <label for="filter-show-deleted" class="mr-2">Show deleted</label>
        <InputSwitch id="filter-show-deleted" v-model="showDeleted" @change="onChangeShowDeleted"/>
      </template>
    </Toolbar>
    <DataTable lazy :value="items" v-model:editingRows="editingRows" editMode="row" dataKey="id"
               paginator :rows="rows" :rowsPerPageOptions="[5, 10, 20, 50]"
               :loading="loading" :first="first" :total-records="totalRecords"
               :sortField="sortField" :sortOrder="sortOrder" @sort="onSort($event)" @page="onPage($event)"
               v-model:filters="filters" filterDisplay="row" @filter="onFilter($event)"
               @rowEditSave="onRowEditSave($event)"
               stateStorage="session">
      <template #empty> Records not found.</template>
      <template #loading> Loading records data. Please wait.</template>
      <Column field="id" header="ID" sortable :style="{width: '40px'}"/>
      <Column field="registrationPlate" header="Registration plate" filterMatchMode="contains" sortable sorted
              :showFilterMenu="false">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]"/>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter"
                     placeholder="Search"/>
        </template>
      </Column>
      <Column field="vehicleBrand" header="Brand" :showFilterMenu="false">
        <template #body="{ data, field }">
          {{ data[field].data ? data[field].data?.title : "(Deleted)" }}
        </template>
        <template #filter="{filterModel,filterCallback}">
          <Dropdown v-model="filterModel.value" filter @change="filterCallback()" optionLabel="label"
                    optionValue="value" :options="vehicleBrandItems" placeholder="Select One">
          </Dropdown>
        </template>
      </Column>
      <Column field="vehicleModel" header="Model" :showFilterMenu="false">
        <template #body="{ data, field }">
          {{ data[field].data ? data[field].data?.title : "(Deleted)" }}
        </template>
        <template #editor="{ data, field }">
          <Dropdown v-model="data[field].data.id" filter optionLabel="label"
                    optionValue="value" :options="vehicleModelItems" placeholder="Select One">
          </Dropdown>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <Dropdown v-model="filterModel.value" filter @change="filterCallback()" optionLabel="label"
                    optionValue="value" :options="vehicleModelItems" placeholder="Select One">
          </Dropdown>
        </template>
      </Column>
      <Column field="fuelTankCapacity" header="Fuel tank capacity, l" sortable>
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" :min="0" :max="10000" :minFractionDigits="3"
                       :maxFractionDigits="3"/>
        </template>
      </Column>
      <Column field="averageFuelConsumption" header="Average fuel consumption, l/100 km" sortable>
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" :min="0" :max="1000" :minFractionDigits="3"
                       :maxFractionDigits="3"/>
        </template>
      </Column>
      <Column field="estimatedDistance" header="Estimated distance, km"></Column>
      <Column :rowEditor="true" :style="{width: '80px'}"></Column>
      <Column :exportable="false" :style="{width: '40px'}">
        <template #body="slotProps">
          <template v-if="showDeleted">
            <Button icon="pi pi-undo" outlined rounded severity="danger" @click="confirmRestore(slotProps.data)"/>
          </template>
          <template v-if="!showDeleted">
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)"/>
          </template>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
        <span>Are you sure you want to delete the selected record?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" severity="warning"/>
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelected"/>
      </template>
    </Dialog>
    <Dialog v-model:visible="restoreDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
        <span>Are you sure you want to restore the deleted record?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" severity="warning"/>
        <Button label="Yes" icon="pi pi-check" text @click="restoreSelected"/>
      </template>
    </Dialog>
  </main>
</template>

<script lang="ts">
import {VehicleService} from '@/service/VehicleService';
import type {
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableRowEditSaveEvent,
  DataTableSortEvent
} from "primevue/datatable";
import TableLazyData from "@/views/vehicle/TableLazyData";
import {ref} from "vue";
import {VehicleModelService} from "@/service/VehicleModelService";
import {VehicleBrandService} from "@/service/VehicleBrandService";

import VehicleAddDialog from "@/views/vehicle/VehicleAddDialog.vue";
import JsonApiRequestQueryParams from "@/models/JsonApiRequestQueryParams.ts";

const vehicleService = new VehicleService();
const vehicleModelService = new VehicleModelService();
const vehicleBrandService = new VehicleBrandService();

let params = {
  'include': 'vehicleBrand',
  'sort': 'title'
};

export default {
  components: {VehicleAddDialog},
  emits: [],
  data() {
    let filters = {
      registrationPlate: {value: null, matchMode: 'contains'},
      vehicleBrand: {value: null, matchMode: 'contains'},
      vehicleModel: {value: null, matchMode: 'contains'}
    };
    return {
      vehicleModelItems: [] as any[],
      vehicleBrandItems: [] as any[],
      deleteDialog: false,
      restoreDialog: false,
      selectedItem: {
        id: null
      },
      addDialogVisible: false,
      showDeleted: ref(false),
      loading: false,
      editingRows: [] as any[],
      totalRecords: 0,
      items: [] as any[],
      selectedCustomers: null,
      selectAll: false,
      sortField: 'id',
      sortOrder: 1,
      first: 0,
      rows: 5,
      filters: filters,
      lazyParams: new TableLazyData({
        first: 0,
        rows: 10,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        filters: filters
      })
    }
  },
  mounted() {
    this.vehicleModelItems = [];

    let modelQueryParams = new JsonApiRequestQueryParams();
    modelQueryParams.include = 'vehicleBrand';

    vehicleModelService.getList(modelQueryParams).then((vehicleModels: JsonApiResponse) => {
      vehicleModels.data.map(vehicleModel => {
        let label = vehicleModel.title;
        if (vehicleModel.vehicleBrand.data) {
          label = label + ' (' + vehicleModel.vehicleBrand.data.title + ')';
        } else {
          label = label + ' (Brand deleted)';
        }

        this.vehicleModelItems.push({
          label: label,
          value: vehicleModel.id,
        });
      });
    });

    this.vehicleBrandItems = [];
    vehicleBrandService.getList().then((vehicleBrands: JsonApiResponse) => {
      vehicleBrands.data.map(vehicleBrand => {
        this.vehicleBrandItems.push({
          label: vehicleBrand.title,
          value: vehicleBrand.id,
        });
      });
    });

    this.loading = true;
    this.lazyParams = new TableLazyData({
      first: 0,
      rows: 10,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      filters: this.filters
    });

    this.loadLazyData();
  },
  methods: {
    loadLazyData() {
      this.loading = true;

      let params = new JsonApiRequestQueryParams();
      params.include = 'vehicleModel,vehicleModel.vehicleBrand';
      params.sort = (this.lazyParams.params.sortOrder === -1 ? '-' : '') + this.lazyParams.params.sortField;
      let first = this.lazyParams.params?.first;
      let rows = this.lazyParams.params?.rows;
      params.page = {
        size: this.lazyParams.params.rows,
        number: first && rows ? (first / rows) + 1 : 1
      };

      params.filter = {};
      if (this.lazyParams.params.filters?.registrationPlate?.value) {
        params.filter.registrationPlate = this.lazyParams.params.filters.registrationPlate.value;
      }

      if (this.lazyParams.params.filters?.vehicleModel?.value) {
        if (params.filter.vehicleModel === undefined) {
          params.filter.vehicleModel = {};
        }
        params.filter.vehicleModel.id = [
          {'': this.lazyParams.params.filters.vehicleModel.value}
        ];
      }

      if (this.lazyParams.params.filters?.vehicleBrand?.value) {
        if (params.filter.vehicleModel === undefined) {
          params.filter.vehicleModel = {};
        }

        if (params.filter.vehicleModel.vehicleBrand === undefined) {
          params.filter.vehicleModel.vehicleBrand = {};
        }

        params.filter.vehicleModel.vehicleBrand = {
          id: [
            {'': this.lazyParams.params.filters.vehicleBrand.value}
          ]
        }
      }

      params.filter.trashed = this.showDeleted;

      vehicleService.getList(params).then((items: JsonApiResponse) => {
        this.items = [];
        this.totalRecords = items.meta.page.total;

        items.data.map(vehicle => {
          this.items.push({
            id: vehicle.id,
            registrationPlate: vehicle.registrationPlate,
            fuelTankCapacity: vehicle.fuelTankCapacity,
            averageFuelConsumption: vehicle.averageFuelConsumption,
            estimatedDistance: vehicle.estimatedDistance,
            vehicleModel: vehicle.vehicleModel,
            vehicleBrand: vehicle.vehicleModel.data.vehicleBrand,
          });
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    onPage(event: DataTablePageEvent) {
      this.lazyParams.params = {...this.lazyParams.params, first: event?.first || this.first};
      this.loadLazyData();
    },
    onSort(event: DataTableSortEvent) {
      this.lazyParams.params.sortField = event.sortField?.toString();
      this.lazyParams.params.sortOrder = event.sortOrder?.valueOf();
      this.loadLazyData();
    },
    onFilter(event: DataTableFilterEvent) {
      this.lazyParams.params.filters = this.filters;
      this.loadLazyData();
    },
    onConfirmAdd() {
      this.loadLazyData();
    },
    onRowEditSave(event: DataTableRowEditSaveEvent) {
      vehicleService.update({
        id: event.newData.id,
        registrationPlate: event.newData.registrationPlate,
        fuelTankCapacity: event.newData.fuelTankCapacity,
        averageFuelConsumption: event.newData.averageFuelConsumption,
        vehicleModel: {
          data: {
            id: event.newData.vehicleModel.data.id,
            type: 'vehicle-models',
          }
        }
      }).then(() => {
        this.loadLazyData();
      });
    },
    addNew() {
      this.addDialogVisible = true;
    },
    deleteSelected() {
      this.updateDeletedStatus(this.selectedItem.id, true);

      this.deleteDialog = false;
    },
    restoreSelected() {
      this.updateDeletedStatus(this.selectedItem.id, false);

      this.restoreDialog = false;
    },
    updateDeletedStatus(id: string | null, isDeleted: boolean) {
      vehicleService.update({
        id,
        isDeleted
      }).then(() => {
        this.loadLazyData();
      });
    },

    confirmDelete(prod: any) {
      this.selectedItem = prod;
      this.deleteDialog = true;
    },

    confirmRestore(prod: any) {
      this.selectedItem = prod;
      this.restoreDialog = true;
    },

    onChangeShowDeleted() {
      this.loadLazyData();
    }
  }
}
</script>