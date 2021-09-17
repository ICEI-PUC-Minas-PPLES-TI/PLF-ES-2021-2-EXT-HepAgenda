<template>
<!--Container-->
<v-container fluid style="overflow: auto; padding:6vh;">
    <v-card class="mx-auto" width="100%">
        <v-card-title>
            <span class="text-h6">Gerenciamento de Usuário</span>
        </v-card-title>
        <v-card-actions right>
            <v-spacer></v-spacer>
            <v-btn class="mb-6 mr-2" color="primary" background="primary">
                Criar usuário
            </v-btn>
        </v-card-actions>
        <v-card-text class="text-h5 ">
            <template>
                <v-data-table :headers="headers" :items="usuarios" :items-per-page="5" class="elevation-1">

                    <template v-slot:item.actions="{ item }">
                        <v-icon medium color="primary" class="mr-2" @click="editItem(item)">
                            mdi-square-edit-outline
                        </v-icon>
                        <v-icon medium color="primary" @click="deleteItem(item)">
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

</style>
