<template>
  <div class="grid">
    <!-- ##### TABLE ###### -->
    <q-table
      ref="tableRef"
      flat
      bordered
      grid
      title="Addresses"
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
      <!-- ##### TABLE HEADER ###### -->
      <template v-slot:top-right>
        <!-- ## SEARCH BAR ## -->
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
        <!-- ## OPEN INSERT DIALOG BUTTON ## -->
        <q-btn color="green" @click="insertAddressDialog()" class="addBtn"
          >+</q-btn
        >
      </template>
      <!-- ##### TABLE CONTENT ###### -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <!-- ### -->
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
              <!-- ### -->
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
              <!-- ### -->
              <q-card-section
                style="display: inline-block; padding: 30px"
                class="text-center"
              >
                Geburtstag
                <br />
                <strong>{{ props.row.birthday }}</strong>
              </q-card-section>
              <!-- ### -->
              <q-card-section
                style="display: inline-block; padding: 30px"
                class="text-center"
              >
                Telefonnummer
                <br />
                <strong>{{ props.row.telephone }}</strong>
              </q-card-section>
              <!-- ### -->
            </q-card-section>
            <!-- ### -->
            <q-separator />
            <!-- ## DELETE BUTTON ## -->
            <q-card-section class="flex flex-center">
              <q-btn
                dense
                flat
                @click="deleteAddress(props.row._id.$oid)"
                color="red"
                icon="delete"
              ></q-btn>
              <!-- ## OPEN EDIT DIALOG BUTTON ## -->
              <q-btn
                dense
                flat
                @click="editAddressDialogBtn(props.row)"
                icon="edit_square"
              ></q-btn>
            </q-card-section>
            <!-- ### -->
          </q-card>
        </div>
      </template>
    </q-table>
    <!-- ########## INSERT ADDRESS DIALOG ########## -->
    <q-dialog v-model="createAddressDialog">
      <q-card style="width: 800px">
        <q-card-section>
          <div class="text-h6">Neue Addresse Erstellen</div>
          <q-icon
            name="person_add"
            size="24px"
            style="
              border: 2px;
              padding: 5px;
              right: 10px;
              top: 10px;
              border-radius: 100px;
              border-style: solid;
              position: absolute;
            "
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <table>
            <tr>
              <!-- ## FIRST NAME ## -->
              <td>
                <q-input
                  class="col-md-4 offset-md-4 text-white"
                  style="width: 250px"
                  color="green"
                  label="Vorname"
                  :v-model="address.firstName"
                  :model-value="address.firstName"
                  @change="
                    (value) => {
                      address.firstName = value;
                    }
                  "
                />
              </td>
              <!-- ## LAST NAME ## -->
              <td>
                <q-input
                  class="col-md-4 offset-md-4 text-white"
                  style="width: 250px"
                  color="green"
                  label="Nachname"
                  :v-model="address.lastName"
                  :model-value="address.lastName"
                  @change="
                    (value) => {
                      address.lastName = value;
                    }
                  "
                />
              </td>
              <!-- ### -->
            </tr>
            <br />
            <tr>
              <!-- ## BIRTHDAY ## -->
              <td>
                <q-input
                  class="col-md-4 offset-md-4 text-white"
                  style="width: 250px"
                  color="green"
                  label="Geburtstag"
                  :v-model="address.birthday"
                  :model-value="address.birthday"
                  type="date"
                  @change="
                    (value) => {
                      address.birthday = value;
                    }
                  "
                />
              </td>
              <!-- ## TELEPHONE ## -->
              <td>
                <q-input
                  class="col-md-4 offset-md-4 text-white"
                  style="width: 250px"
                  color="green"
                  label="Telefonnummer"
                  :v-model="address.telephone"
                  :model-value="address.telephone"
                  type="tel"
                  @change="
                    (value) => {
                      address.telephone = value;
                    }
                  "
                />
              </td>
              <!-- ### -->
            </tr>
          </table>
        </q-card-section>

        <q-card-actions align="right" class="text-white">
          <q-btn
            color="green"
            label="Erstellen"
            @click="insertAddress(address)"
          />
          <q-btn color="red" flat label="Schliessen" v-close-popup />
        </q-card-actions>
      </q-card>
      <!-- ########## EDIT ADDRESS DIALOG ########## -->
    </q-dialog>
    <q-dialog v-model="editAddressDialog">
      <q-card style="width: 800px">
        <q-card-section>
          <div class="text-h6">Addresse Bearbeiten</div>
          <q-icon
            name="edit"
            size="24px"
            style="
              border: 2px;
              padding: 5px;
              right: 10px;
              top: 10px;
              border-radius: 100px;
              border-style: solid;
              position: absolute;
            "
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <table>
            <tr>
              <!-- ## FIRST NAME ## -->
              <td>
                <q-input
                  class="col-md-4 offset-md-4 text-white"
                  style="width: 250px"
                  color="green"
                  label="Vorname"
                  :v-model="selected_row.firstName"
                  :model-value="selected_row.firstName"
                  @change="
                    (value) => {
                      selected_row.firstName = value;
                    }
                  "
                />
              </td>
              <!-- ## LAST NAME ## -->
              <td>
                <q-input
                  class="col-md-4 offset-md-4 text-white"
                  style="width: 250px"
                  color="green"
                  label="Nachname"
                  :v-model="selected_row.lastName"
                  :model-value="selected_row.lastName"
                  @change="
                    (value) => {
                      selected_row.lastName = value;
                    }
                  "
                />
              </td>
              <!-- ### -->
            </tr>
            <br />
            <tr>
              <!-- ## BIRTHDAY ## -->
              <td>
                <q-input
                  class="col-md-4 offset-md-4 text-white"
                  style="width: 250px"
                  color="green"
                  label="Geburtstag"
                  :v-model="selected_row.birthday"
                  :model-value="selected_row.birthday"
                  type="date"
                  @change="
                    (value) => {
                      this.selected_row.birthday = value;
                    }
                  "
                />
              </td>
              <!-- ## TELEPHONE ## -->
              <td>
                <q-input
                  class="col-md-4 offset-md-4 text-white"
                  style="width: 250px"
                  color="green"
                  label="Telefonnummer"
                  :v-model="selected_row.telephone"
                  :model-value="selected_row.telephone"
                  type="tel"
                  @change="
                    (value) => {
                      selected_row.telephone = value;
                    }
                  "
                />
              </td>
            </tr>
          </table>
        </q-card-section>
        <!-- ## SAVE EDIT ADDRESS BUTTON ## -->
        <q-card-actions align="right" class="text-white">
          <q-btn
            color="green"
            label="SPEICHERN"
            @click="editAddress(selected_row)"
          />
          <!-- ## CLOSE BUTTON ## -->
          <q-btn color="red" flat label="Schliessen" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { useQuasar, QSpinnerFacebook, LoadingBar, Notify } from "quasar";
import { webApi } from "src/composables/WebApi";
import { ref, onMounted, onBeforeUnmount } from "vue";

LoadingBar.setDefaults({
  color: "blue",
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
  { name: "actions", label: "Aktionen", field: "" },
];

let originalRows = ref([]);
let rows = ref([]);

export default {
  mounted() {
    this.getAddresses();
  },
  methods: {
    insertAddressDialog() {
      this.createAddressDialog = true;
    },
    editAddressDialogBtn(locationRow) {
      this.selected_row = locationRow;
      this.editAddressDialog = true;
    },
    getAddresses() {
      axios.get(`${webApi.server}/api/getAddresses`).then((res) => {
        (originalRows.value = res.data),
          originalRows.value.forEach((row, index) => {
            row.index = index + 1;
          });
        rows.value = originalRows.value;
      });
    },
    insertAddress(address) {
      const addressObject = {
        firstName: address.firstName,
        lastName: address.lastName,
        birthday: address.birthday,
        telephone: address.telephone,
      };

      axios
        .post(
          `${webApi.server}/api/insertAddress`,
          { address: addressObject },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data == "ADDRESS INSERTED") {
            Notify.create({ type: "info", message: res.data, color: "green" });
            this.createAddressDialog = false;
            this.clearAddressDialog();
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
    editAddress(address) {
      const addressObject = {
        id: address._id.$oid,
        firstName: address.firstName,
        lastName: address.lastName,
        birthday: address.birthday,
        telephone: address.telephone,
      };

      axios
        .post(
          `${webApi.server}/api/editAddress`,
          { address: addressObject },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data == "ADDRESS SAVED") {
            Notify.create({ type: "info", message: res.data, color: "green" });
            this.editAddressDialog = false;
            this.clearAddressDialog();
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
    deleteAddress(id) {
      const addressObject = {
        id: id,
      };
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
    clearAddressDialog() {
      this.address.firstName = "";
      this.address.lastName = "";
      this.address.birthday = "";
      this.address.telephone = "";
      this.selected_row = {};
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

      address: ref({
        firstName: ref(""),
        lastName: ref(""),
        birthday: ref(""),
        telephone: ref(""),
      }),

      createAddressDialog: ref(false),
      editAddressDialog: ref(false),

      selected_row: ref({}),

      onRequest,
    };
  },
};
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 40px;
  grid-row-gap: 40px;
}
.addBtn {
  left: 7px;
}
</style>
