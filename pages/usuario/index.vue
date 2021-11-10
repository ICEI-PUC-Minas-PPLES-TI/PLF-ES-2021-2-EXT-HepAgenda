<template>
<!--Container-->
<v-container fluid style="overflow: auto; padding:6vh;">
    <v-card class="mx-auto" width="100%">
        <div class="div-titulo-btn">
            <v-card-title>
                <span class="text-h6">Gerenciamento de Usuário</span>
            </v-card-title>
            <v-card-actions>
                <v-btn disabled color="primary" background="primary">
                    Criar usuário
                </v-btn>
            </v-card-actions>
        </div>
        <v-card-text class="text-h5 ">
            <template>
                <v-data-table :headers="headers" :items="usuarios" :items-per-page="5" class="elevation-1">
                    <template v-slot:item.tipo="{ item }">
                        {{ formataTipo(item.tipo) }}
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon disabled color="primary" class="mr-2" @click="editItem(item)">
                            mdi-square-edit-outline
                        </v-icon>
                        <v-icon disabled color="primary" @click="deleteItem(item)">
                            mdi-trash-can-outline
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="primary" @click="initialize">
                            Reset
                        </v-btn>
                    </template>
                </v-data-table>
            </template>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script src="./index.js"> </script>

<style>
.div-titulo-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between !important;
}
</style>
