<template>
    <div class="row">
        <div class="col-lg-12">
            List of suspected SSN:
            <div class="row">
                <div class="col-lg-3" v-for="item in ssnList">
                    <div class="card bg-light mb-3" style="max-width: 18rem;">
                        <div class="card-header">{{ item.ssn }}</div>
                        <div class="card-body">
                            <h5 class="card-title">Light card title</h5>
                            <p class="card-text"><button type="button" class="btn btn-info" @click="graph(item.ssn)">Investigate</button></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "SSNcards",
        props: ['ssnList']
    }
</script>

<style scoped>

</style>