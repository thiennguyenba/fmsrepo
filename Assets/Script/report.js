'use strict'

require('linqjs')

function report() { }

// Dict lưu toàn bộ bảng được chọn
report.selectedTables = {}

// Tính giá trị suffix tiếp theo để tạo đối tượng
report.getNextSuffixOfTable = function (table) {
    if (!report.selectedTables[table]) {
        report.selectedTables[table] = 0
    }

    return report.selectedTables[table] + 1
}

report.getQueryData = function () {
    var pnlWizard = Ext.getCmp("pnlWizard")
    , rowsValues = pnlWizard.getRowsValues()
    , stWizard = pnlWizard.getStore()

    var criteriaData = []
    , orData = []

    if (rowsValues.length > 0) {
        rowsValues.forEach(function (item, i) {
            criteriaData.push({
                Column: item.Column,
                Table: item.Table,
                Output: item.Output,
                Criteria: item.Criteria
            })
        })

        stWizard.getModel().getFields()
            .where(function (x) { return x.getName().startsWith('Or') })
            .select(function (x) { return x.getName() })
            .forEach(function (item, i) { // Duyệt từng cột Or*
                var orRowData = []
                rowsValues.forEach(function (it) { // Duyệt từng hàng trên Wizard
                    orRowData.push({
                        Column: it.Column,
                        Table: it.Table,
                        Output: it.Output,
                        Criteria: it[item]
                    })
                })

                orData.push(orRowData)
            })
    }

    return {
        selectedTables: report.selectedTables,
        Items: criteriaData,
        Or: orData
    };
}

// Map toàn bộ sự kiện Listener.RowClick.Handler
report.table_grid_onRowClick = function (item, record, node, index, e) {
    var grid = this
    , stWizard = Ext.getCmp("pnlWizard").getStore()

    var hasSelected = !record.get('Selected')
    record.set('Selected', hasSelected)

    if (hasSelected) {
        stWizard.add({
            id: record.id,
            Column: record.get("ColumnName"),
            Table: grid.tableDisplayName,
            Output: true,
            Criteria: ""
        })
    }
    else {
        stWizard.remove(stWizard.getById(record.id))
    }

    var requestData = report.getQueryData()
    App.direct.TableGrid_OnRowClick(requestData, {
        eventMask: {
            showMask: true
        }
    })

    grid.getSelectionModel().deselectAll()
}

// Map toàn bộ sự kiện Listener.Close.Handler
report.table_win_onClose = function (item) {
    var win = this
    , table = win.table
    , tableDisplayName = win.down('grid').tableDisplayName
    , pnlWizard = Ext.getCmp("pnlWizard")
    , stWizard = pnlWizard.getStore()

    var removeRecordFilter = stWizard.getData().createFiltered(function(item) {
        return item.get('Table') == tableDisplayName;
    })

    stWizard.remove(removeRecordFilter.getRange())

    if (report.selectedTables[table]) {
        report.selectedTables[table]--
    }

    var requestData = report.getQueryData()
    App.direct.TableGrid_OnClose(requestData, {
        eventMask: {
            showMask: true
        }
    })
}

// Map toàn bộ sự kiện Listener.ItemDblClick.After
report.pnlTableList_AfterItemDblClick = function (item, record, node, index, e, el, type, action, extraParams, o) {
    var table = extraParams["table"]

    if (!report.selectedTables[table]) {
        report.selectedTables[table] = 0
    }
    
    report.selectedTables[table]++
}

report.pnlWizzard_onCellEdit = function (item, e) {
    var requestData = report.getQueryData()
    App.direct.pnlWizzard_OnCellEdit(requestData, {
        eventMask: {
            durationMessages: [{
                duration: 300,
                message: "Vui lòng chờ..."
            }]
        }
    })
}

module.exports = report
