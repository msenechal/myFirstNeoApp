<template>

    <div>
        <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd;">
            <a class="navbar-brand" href="#"><img src="@/assets/neo4j_logo.svg" width="80px"/></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="openComponent('FraudRings')">Fraud rings</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="openComponent('Crime')">Crimes</a>
                    </li>
                </ul>
            </div>
        </nav>
        <div>
            <component :is="dynamicComponent"></component>
        </div>
    </div>
</template>

<script>
    import FraudRings from "../components/FraudRings";
    import Crime from "../components/Crime";

    export default {
        name: 'neo4j',
        components: {Crime, FraudRings},
        data() {
            return {
                dynamicComponent: String
            }
        },
        methods: {
            openComponent: function(component){
                this.dynamicComponent = component
            }
        }
    }
</script>

<style scoped>

</style>