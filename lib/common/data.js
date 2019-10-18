const fs = require('fs');
const path = require('path');
const file = require('./file');

//TODO 要注意递归使用

const filterCSVData = (group, groupKeyValue, columns) => {
    let filteredRow = [], groupedData = [];
    if (groupKeyValue != undefined && groupKeyValue != '') {
        //TODO group[groupKeyValue] 也必须存在
        groupedData = group[groupKeyValue];
        const columnIndex = [];
        filteredRow = groupedData.map((item, index) => {
            //TODO 列名的转换
            return item.filter((v, i) => columns.includes(i));
        })
    } else {
        Object.keys(group).map(key => {
            groupedData = group[key];
            // console.log(groupedData.length)
        });
    }
    return filteredRow;
};

module.exports = {
    getCSVData: (path, name) => {
        return fs.readFileSync(path).toString()
    },
    groupCSVData: (path, groupKey) => {
        return new Promise(function (resolve, reject) {
            file().readFileToArray(path)
                .then((array) => {
                    const firstRow = array[0].split(",");
                    const column = {};
                    firstRow.forEach((item, index) => {
                        column[item] = index;
                    });
                    const dataRow = array.map((item, index) => {
                        if (index > 0) {
                            return item.split(",");
                        } else {
                            return null
                        }
                    }).filter(t => t != null);
                    return {column, dataRow}
                })
                .then((data) => {
                    const group = {};
                    // const groupKey = 'ip_addr';
                    const groupValue = new Set();
                    data.dataRow.forEach((item, index) => {
                        groupValue.add(item[data.column[groupKey]]);
                    });
                    Array.from(groupValue).forEach((value) => {
                        const groupDataRow = [];
                        data.dataRow.forEach((item, index) => {
                            if (item[data.column[groupKey]] == value) {
                                groupDataRow.push(item)
                            }
                        });
                        group[value] = groupDataRow;
                    });
                    resolve({column: data.column, group});
                })

        });
    },
    specifyPromisedGroupedColumnData: (groupedData, groupKeyValue, columns) => {
        return new Promise(function (resolve, reject) {
            groupedData.then(({column, group}) => {
                const data = filterCSVData(group, groupKeyValue, columns);
                resolve(data);
            });
        });
    },
    specifyGroupedColumnData: (groupedData, groupKeyValue, columns) => {
        const {column, group} = groupedData;
        return new Promise(function (resolve, reject) {
            const data = filterCSVData(group, groupKeyValue, columns);
            resolve(data);
        });
    }
}
