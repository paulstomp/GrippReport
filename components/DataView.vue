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

            <tr v-for="(row, index) in data" :key=index>
                <td v-for="(field, index) in Object.keys(data[0])" :key=index style="padding: 5px;">
                    {{ prettyValue(row[field]) }}
                </td>
            </tr>

        </tbody>
    </table>

</template>

<script setup lang="ts">

    const props = defineProps(['data', 'maxLength']);

    function prettyValue(value: any) {

        if (!value) {
            return '-';
        }

        if (typeof value == "string") {
            const regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (value.slice(0, 10).match(regEx)) {
                return value.slice(0, 10);
            }

            if (!isNaN(value)) {
                return parseFloat(value);
            }

            if (props.maxLength) {
                return value.slice(0, props.maxLength);
            }
        }

        return value;
    }

</script>
