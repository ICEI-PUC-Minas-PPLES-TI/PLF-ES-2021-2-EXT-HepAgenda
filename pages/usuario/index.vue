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
        <v-card-text>
            <template>
                <v-data-table
                    :headers="headers"
                    :items="usuarios"
                    :items-per-page="-1"
                    :loading="tabelaCarregando"
                    :disable-sort="true"
                    :footer-props="{
                        'disable-items-per-page': true,
                        'disable-pagination': true
                    }"
                    class="elevation-1 usuario-table"
                >
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
                <br>
                <span class="text-muted text-right d-block">
                    Total de Items: {{ totalItems }}
                </span>
                <br>
                <v-pagination
                    v-model="tabelaPaginaAtual"
                    :length="tabelaPaginas"
                    @input="listaUsuarios"
                />
            </template>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script src="./index.js"> </script>

<style lang="scss">
.div-titulo-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between !important;
}
.usuario-table{
    .v-data-footer{
        display: none;
    }
}
</style>
