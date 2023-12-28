<template>

    <table>
        <tbody>

            <!-- Header -->

            <tr style="font-weight: bold">
                <td v-for="(field, index) in Object.keys(data[0])" :key=index style="padding: 5px;">
                    {{ field }}
                </td>
            </tr>

            <!-- Data -->

            <tr v-for="(row, index) in data" :key=index class="view">
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
