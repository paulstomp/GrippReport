<template>

    <table>
        <tbody>

            <!-- Header -->

            <tr height="30px" style="font-weight: bold">
                <td v-for="(field, index) in Object.keys(data[0])" :key=index style="padding: 5px;" nowrap>
                    <div @click="sort(field)" style="cursor: pointer;">
                        {{ field.replaceAll('_', ' ') }}
                        <span style="width: 20px; display: inline-block;">{{ getSortIcon(field) }}</span>
                    </div>
                </td>
            </tr>

            <!-- Data -->

            <tr v-for="(row, index) in tableData" :key=index class="view">
                <td v-for="(field, index) in Object.keys(data[0])" :key=index style="padding: 5px;">
                    {{ prettyValue(row[field]) }}
                </td>
            </tr>

        </tbody>
    </table>

</template>

<style>

    .view:hover {
        background-color: Aquamarine;
        color: #202020;
    }

</style>

<script setup lang="ts">

    const props = defineProps(['data', 'maxLength']);

    var tableData = ref(props.data);
    var sortField = ref('');
    var sortOrderAsc = ref(true);

    function sort(field: string) {
        if (field == sortField.value) {
            sortOrderAsc.value = !sortOrderAsc.value;
        } else {
            sortField.value = field;
            sortOrderAsc.value = true;
        }

        tableData.value.sort((rowA: any, rowB: any) => compare(rowA[field], rowB[field]));
    }

    function compare(a: any, b: any) {
        var difference: number;
        const aNum = a ? parseFloat(a) : 0;
        const bNum = b ? parseFloat(b) : 0;
        if (!isNaN(aNum) && !isNaN(bNum)) {
            difference = aNum - bNum;
        } else {
            difference = a.localeCompare(b);
        }
        return sortOrderAsc.value ? difference : -difference;
    }

    function getSortIcon(field: string) {
        if (field == sortField.value) {
            return sortOrderAsc.value ? '▼' : '▲';
        }
    }

    function prettyValue(value: any) {

        if (!value) {
            return '-';
        }

        if (typeof value == "string") {
            const regExDate = /^\d{4}-\d{2}-\d{2}$/;
            if (value.slice(0, 10).match(regExDate)) {
                return value.slice(0, 10);
            }

            const number = parseFloat(value);
            if (!isNaN(number)) {
                return number;
            }

            if (props.maxLength) {
                return value.slice(0, props.maxLength);
            }
        }

        return value;
    }

</script>
