<template>
  <div class="grid">
    <q-table
      ref="tableRef"
      flat
      bordered
      grid
      title="User"
      class="my-sticky-header-table"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      :key="tableKey"
      binary-state-sort
      @request="onRequest"
      wrap-cells="true"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Suchen"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn color="green" @click="addUser()" class="addBtn">+</q-btn>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-card-section class="flex flex-center">
              <q-icon
                name="person"
                size="34px"
                style="
                  border: 2px;
                  padding: 5px;
                  left: 10px;
                  top: 10px;
                  border-radius: 100px;
                  border-style: solid;
                  position: absolute;
                "
              />
              <q-card-section
                style="display: inline-block; padding: 30px"
                class="text-center"
              >
                Name
                <br />
                <strong
                  >{{ props.row.firstName }} {{ props.row.lastName }}</strong
                >
              </q-card-section>
              <q-card-section
                style="display: inline-block; padding: 30px"
                class="text-center"
              >
                Geburtstag
                <br />
                <strong>{{ props.row.birthday }}</strong>
              </q-card-section>
              <q-card-section
                style="display: inline-block; padding: 30px"
                class="text-center"
              >
                Telefonnummer
                <br />
                <strong>{{ props.row.telephone }}</strong>
              </q-card-section>
            </q-card-section>
            <q-separator />
            <q-card-section class="flex flex-center">
              <q-btn
                dense
                flat
                @click="deleteAddress(props.row._id.$oid)"
                color="red"
                icon="delete"
              ></q-btn>
              <q-btn
                dense
                flat
                @click="editUserInfo(subprops.row)"
                icon="edit_square"
              ></q-btn>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import axios from "axios";
import { useQuasar, QSpinnerFacebook, LoadingBar, Notify, date } from "quasar";
import { webApi } from "src/composables/WebApi";
import {
  ref,
  computed,
  nextTick,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

LoadingBar.setDefaults({
  color: "purple",
  size: "7px",
  position: "bottom",
});

const columns = [
  {
    name: "index",
    label: "ID",
    field: "index",
    align: "center",
  },
  {
    name: "firstName",
    label: "Vorname",
    align: "center",
    field: "firstName",
  },
  {
    name: "lastName",
    label: "Nachname",
    align: "center",
    field: "lastName",
  },
  {
    name: "birthday",
    label: "Geburtstag",
    align: "center",
    field: "birthday",
  },
  {
    name: "telephone",
    label: "Telefonnummer",
    align: "center",
    field: "telephone",
  },
  { name: "actions", label: "Aktionen", field: "", sortable: false },
];

let originalRows = ref([]);
let rows = ref([]);

export default {
  mounted() {
    this.getAddresses();
  },
  methods: {
    getAddresses() {
      axios.get(`${webApi.server}/api/getAddresses`).then((res) => {
        (originalRows.value = res.data),
          originalRows.value.forEach((row, index) => {
            row.index = index + 1;
          });
        rows.value = originalRows.value;
      });
    },
    deleteAddress(id) {
      const addressObject = {
        addressID: id,
      };
      console.log(addressObject);
      axios
        .post(
          `${webApi.server}/api/deleteAddress`,
          { address: addressObject },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data == "ADDRESS DELETED") {
            Notify.create({
              type: "info",
              message: res.data,
              color: "green",
            });
            this.getAddresses();
            this.tableKey += 1;
          } else {
            Notify.create({
              type: "warning",
              message: res.data,
              color: "red",
              textColor: "white",
              iconColor: "white",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  setup() {
    const $q = useQuasar();
    let timer;
    const tableRef = ref();
    const filter = ref("");
    const loading = ref(false);
    const pagination = ref({
      sortBy: "index",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
    });

    let tableKey = ref(0);

    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    function fetchFromServer(startRow, count, filter, sortBy, descending) {
      filter = filter.toLowerCase();
      const data = filter
        ? originalRows.value.filter(
            (row) =>
              row.firstName.toLowerCase().includes(filter) ||
              row.lastName.toLowerCase().includes(filter) ||
              (
                row.firstName.toLowerCase() +
                " " +
                row.lastName.toLowerCase()
              ).includes(filter) ||
              row.birthday.includes(filter) ||
              row.telephone.includes(filter)
          )
        : originalRows.value.slice();

      // handle sortBy
      if (sortBy) {
        const sortFn =
          sortBy === "desc"
            ? descending
              ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
              : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
            : descending
            ? (a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy])
            : (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
        data.sort(sortFn);
      }

      return data.slice(startRow, startRow + count);
    }

    // emulate 'SELECT count(*) FROM ...WHERE...'
    function getRowsNumberCount(filter) {
      filter = filter.toLowerCase();
      if (!filter) {
        return originalRows.value.length;
      }
      let count = 0;
      originalRows.value.forEach((address) => {
        if (
          address.firstName.toLowerCase().includes(filter) ||
          address.lastName.toLowerCase().includes(filter) ||
          (
            address.firstName.toLowerCase() +
            " " +
            address.lastName.toLowerCase()
          ).includes(filter) ||
          address.birthday.includes(filter) ||
          address.telephone.includes(filter)
        ) {
          ++count;
        }
      });
      return count;
    }

    function onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      setTimeout(() => {
        // update rowsCount with appropriate value
        pagination.value.rowsNumber = getRowsNumberCount(filter);

        // get all rows if "All" (0) is selected
        const fetchCount =
          rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

        // calculate starting row of data
        const startRow = (page - 1) * rowsPerPage;

        // fetch data from "server"
        const returnedData = fetchFromServer(
          startRow,
          fetchCount,
          filter,
          sortBy,
          descending
        );

        // clear out existing data and add new
        rows.value.splice(0, rows.value.length, ...returnedData);

        // don't forget to update local pagination object
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;

        // ...and turn of loading indicator
        loading.value = false;
      }, 1500);
    }

    onMounted(() => {
      // get initial data from server (1st page)
      tableRef.value.requestServerInteraction();
    });

    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    return {
      showLoading() {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: "yellow",
          spinnerSize: 40,
          backgroundColor: "black",
          message: "Köche werden geladen...",
          messageColor: "white",
        });

        // hiding in 3s
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 3000);
      },

      tableRef,
      filter,
      loading,
      pagination,
      columns,
      rows,

      tableKey,

      user: ref({
        firstName: ref(""),
        lastName: ref(""),
        birthday: ref(""),
        telephone: ref(""),
      }),

      selected_row: ref({}),

      onRequest,
    };
  },
};
</script>