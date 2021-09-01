define(["underscore", "ng!$q", "ng!$http","qlik","qvangular"], function(_, $q, $http, qlik, qv) {
    "use strict";	
	return {
        type: "items",
        component: "accordion",
		label: "LogiExport Settings",
        items: {
			   		general: {
                  		items: {
                            showTitles: {
                                defaultValue: !1
                            }
                        },
						show: false
                    },					
                    selections: {                        
						show: false
                    },					
					fileOptions: {
                        type: "items",
                        label: "File settings",
                        items: {							
							keepOriginalColors: {
								type: "boolean",
								label: "Keep original formatting⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nKeeps the coloring and the links from the Table / Pivot",
								ref: "props.keepOriginalColors",
								defaultValue: false,
								show: function (e) {return (e.props.fileFormat || 'XLSX') == 'XLSX';}
							},
							exportObjId : {
                                ref: "props.exportObjId",
                                label: "Object ID to Export⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \r\nSet The object ID to Export.\r\nTip: add /options/developer to the URL and use developer menu or the Share/Embed menu to get the ID",
                                type: "string",
                                expression: "optional",
								show: function(e) {
									return !e.props.multiObjects;
								}
                            },
							useTemplate: {
								type: "boolean",
								label: "Design by Template File⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nUse your existing Pre-designed Excel file as a Template,\r\nUpload the xlsx file once, and when the user clicks the button, the data will be exported using the Template\r\n(The xlsx File is saved in App Content)\r\nP.S. Using this option disables some of the Extension functionality, since it can be easily done in the Template",
								ref: "props.useTemplate",
								defaultValue: false,
								show: function (e) {return (e.props.fileFormat || 'XLSX') == 'XLSX';}			
							},
							dataAddress: {
								type: "string",
								ref: "props.dataAddress",
								label: "Data Location Cell⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSets the location in the template where the Data will be inserted,\r\nUse a Valid Excel Address, for Example 'Sheet1!A2'",
								expression: "optional",
								show: function(e) {
									return e.props.useTemplate && !e.props.multiObjects && (e.props.fileFormat || 'XLSX') == 'XLSX';
								}
							}, 
							selAddress: {
								type: "string",
								ref: "props.selAddress",
								label: "Selections Location Cell⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSets the location in the template where the Selections will be inserted,\r\nUse a Valid Excel Address, for Example 'Sheet1!A1'",
								expression: "optional",
								show: function(e) {
									return e.props.useTemplate && !e.props.multiObjects && (e.props.fileFormat || 'XLSX') == 'XLSX';
								}
							},
							uploadTemplate: {
								label: "Save the Template",
								component: "uplButton",
								show: function(e) {
									return e.props.useTemplate && (e.props.fileFormat || 'XLSX') == 'XLSX';
								},
								action: function(data){
									upLogiExport(data, qlik);
								}
							},
							downloadTemplate: {
								label: "Get current Template",
								component: "button",
								show: function(e) {
									return e.props.useTemplate && (e.props.fileFormat || 'XLSX') == 'XLSX';
								},
								action: function(data){
									downLogiExport(data, qlik);
								}
							},
							exportFileName: {
                                ref: "props.exportFileName",
                                label: "File name (optional) ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSets the file Name for the downloaded file, If not set the File name will be the Visualization Title\r\n P.S. Ignored when exporting multiple files",
                                type: "string",
                                expression: "optional"
                            },
							fileFormat: {
                                ref: "props.fileFormat",
                                label: "File Format",
                                type: "string",
								component: "dropdown",
								defaultValue: "XLSX",
								options: [{
									value: "XLSX",
									label: "Excel (xlsx)"
									}, {
									value: "CSV_C",
									label: "CSV (Comma seperator)"
									}, {
									value: "CSV_T",
									label: "CSV (Tab seperator)"
									}
								]
							}
							
							
                        }
                    },
					settings: {
                        type: "items",
                        label: "Button Settings",
                        items: {							
                            buttonLabel: {
                                ref: "props.buttonLabel",
                                label: "Button Label ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSets the button Label",
                                type: "string",
                                expression: "optional",
								defaultValue: "Export"
                            },
							buttonClass: {
                                ref: "props.buttonClass",
                                label: "Button Style ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSets the button Color",
                                type: "string",
								component: "dropdown",
                                expression: "optional",
								defaultValue: "lui-button--info",
								options: [{
									value: "",
									label: "Plain"
									}, {
										value: "lui-button--info",
										label: "Info"
									}, {
										value: "lui-button--gradient",
										label: "Gradient"
									}, {
										value: "lui-button--danger",
										label: "Danger"
									}, {
										value: "lui-button--warning",
										label: "Warning"
									}, {
										value: "lui-button--success",
										label: "Success"
									}
								]
							}
						}
					},
					MultipleObjects: {
                        type: "items",
                        label: "Multiple Objects And Cycle Export",
                        items: {
                            multiObjects: {
								type: "boolean",
								label: "Export multiple Objects  ⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nUse this option if you want to export more than one vizualization at the same time",
								ref: "props.multiObjects",
								defaultValue: false				
							},
							exportObjIds: {
								type: "array",
								ref: "ObjIds",
								label: "Add Object to Export",
								itemTitleRef: "props.ObjSheetName",
								allowAdd: !0,
								allowRemove: !0,
								addTranslation: "Add Object to Export",
								items: {
									ObjId: {
										type: "string",
										ref: "props.ObjId",
										label: "Object ID⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \r\nSet The object ID to Export.\r\nTip: add /options/developer to the URL and use developer menu or the Share/Embed menu to get the ID",
										expression: "optional"
									},
									customSheetName: {
										ref: "props.ObjSheetName",
										label: "Sheet \\ File Name ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \r\nSet the Sheet Name for this Object, if you choose Split to='Files' it will be The File name",
										type: "string",
										expression: "optional",
										show: function (e) {return (e.props.fileFormat || 'XLSX') == 'XLSX';}

									},
									dataAddress: {
										type: "string",
										ref: "props.ObjdataAddress",
										label: "Data Location Cell ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \r\nSets the location in the template where the Data will be inserted,\r\nUse a Valid Excel Address, for Example 'Sheet1!A2'",
										expression: "optional",
										show: function (e) {return (e.props.fileFormat || 'XLSX') == 'XLSX';}
									},
									selAddress: {
										type: "string",
										ref: "props.ObjselAddress",
										label: "Selections Location Cell ⠀⠀⠀⠀⠀⠀⠀\r\nSets the location in the template where the Selections will be inserted,\r\nUse a Valid Excel Address, for Example 'Sheet1!A1'",
										expression: "optional",
										show: function (e) {return (e.props.fileFormat || 'XLSX') == 'XLSX';}
									},
								},
								show: function(e) {
									return e.props.multiObjects;
								}
							},
                            cycleField: {
                                ref: "props.cycleField",
                                label: "Cycle Dimension (Beta)  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nExport The Same Visualization broken down by the possible values in the Field,\r\n You can split it to Sheets or to Files",
                                type: "string",
                                expression: "optional",
								show: function(e) {
									return !e.props.multiObjects;
								}
                            },
							cycleFieldInterval: {
								type: "integer",
								label: "Cycle Field Selection Interval  ⠀⠀⠀⠀⠀\r\nMilliseconds to wait between selections",
								ref: "props.cycleFieldInterval",
								defaultValue: 5000,
								show: function(e) {
									return e.props.cycleField != '' && !e.props.multiObjects && (e.props.fileFormat || 'XLSX') == 'XLSX';
								}
							},
							cycleTo: {
								type: "string",
								component: "dropdown",
								label: "Split to⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nChoose whether to create one file with all Sheets or Different File for each Sheet",
								ref: "props.cycleTo",
								defaultValue: false,
								show: function(e) {
									return (e.props.fileFormat || 'XLSX') == 'XLSX' && (e.props.cycleField != '' || e.props.multiObjects);
								},
								defaultValue: "Sheets",
								options: [{
									value: 'Sheets'
								},{
									value: 'Files'
								}]
							}
						}
					},
                    sheetFormatOptions: {
                        type: "items",
                        label: "Sheet formatting",						
						show: function(e) {
							return !e.props.useTemplate && (e.props.fileFormat || 'XLSX') == 'XLSX';
						},
						items: {
						    customSheetName: {
                                ref: "props.customSheetName",
                                label: "Custom Sheet Name⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nThe name of the sheet in the exported xlsx file. default is 'Sheet1'",
                                type: "string",
                                expression: "optional",
								show: function(e) {
                                        return !e.props.multiObjects;
                                    }
                            },
							ReportCaption: {
                                ref: "props.reportCaption",
                                label: "Report Headline ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nInserts a headline in an additional line in the top of the Sheet",
                                type: "string",
                                expression: "optional"
                            },
							RTLCheckbox: {
								type: "boolean",
								label: "Right To Left ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nChange the Sheet Direction to Right-to-Left",
								ref: "props.RTL",
								defaultValue: false
							},
							addSelectionsCheckbox: {
								type: "boolean",
								label: "Add Selection Context to File⠀\r\nInserts the Current Selection details in an additional line(s) in the top of the Sheet",
								ref: "props.addSelections",
								defaultValue: false,
								show: function(e) {
                                        return !e.props.multiObjects;
                                    }
							},
							SelectionsLocation: {
								type: "string",
								label: "Selection Context Cell⠀⠀⠀⠀⠀⠀\r\nCustom locateing the Selection context data within the sheet, if empty it will be automatically located on the Top fo The Sheet",
								expression: "optional",
								ref: "props.addSelectionsLocation",
								show: function(e) {
                                        return e.props.addSelections && !e.props.multiObjects;
                                    }
							},
							addSelectionsLabel: {
								type: "string",
								label: "Selection Context Label⠀⠀⠀⠀⠀⠀\r\nInserts a header in an additional line on the top of the selections, Example 'Your Selections:'",
								expression: "optional",
								ref: "props.addSelectionsLabel",
								show: function(e) {
                                        return e.props.addSelections;
                                    }
							},
							excludeColsFromSelections: {
								type: "string",
								label: "Fields Excluded from Selection Context\r\nExclude Specific Fields from the Selections Export (System Fields etc.).\r\nvalue is the names of the fields, comma-separated.",
								expression: "optional",
								ref: "props.excludeColsFromSelections",
								show: function(e) {
                                        return e.props.addSelections;
                                    }
							},
							addTotals: {
								type: "boolean",
								label: "Add Totals Row⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nAdd the table’s totals row on the bottom of the sheet",
								ref: "props.addTotals",
								defaultValue: false
							},
							boldTotals: {
								type: "boolean",
								label: "Bold Totals Row⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nMake total row font Bold",
								ref: "props.boldTotals",
								defaultValue: true,
								show: function(e) {
                                        return e.props.addTotals;
                                    }
							},
							borderColor: {
								type: "string",
								label: "Table Border Color⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table borders color in hex. example: ='ff0000'",
								ref: "props.borderColor",
								expression: "optional"
							},
							borderStyle: {
								type: "string",
								component: "dropdown",
								label: "Table Border Style⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table borders style",
								ref: "props.borderStyle",
								defaultValue: "",
								options: [{
									value: ''
								},{
									value: 'hair'
								},{
									value: 'dotted'
								},{
									value: 'dashDotDot'
								},{
									value: 'dashed'
								},{
									value: 'mediumDashDotDot'
								},{
									value: 'thin'
								},{
									value: 'slantDashDot'
								},{
									value: 'mediumDashDot'
								},{
									value: 'mediumDashed'
								},{
									value: 'medium'
								},{
									value: 'thick'
								},{
									value: 'double'
								}]
							}
                        }
                    },
					columnHeaderFormatting: {
                        type: "items",
                        label: "Column header formatting⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nCustomize Specific Columns Style, Format, Width, Colors etc.",
                        show: function(e) {
							return !e.props.useTemplate && (e.props.fileFormat || 'XLSX') == 'XLSX';
						},
						items: {
							boldHeaders: {
								type: "boolean",
								label: "Bold Headers⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nMake the table headers bold",
								ref: "props.boldHeaders",
								defaultValue: true
							},
							bgColorHeaders: {
								type: "string",
								label: "Headers Background Color⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table headers background color in hex. example: ='ff0000'",
								ref: "props.bgColorHeaders",
								expression: "optional"
							},
							wrapHeaders: {
								type: "boolean",
								label: "Headers Text Wrap⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table headers wrap text to On",
								ref: "props.wrapHeaders"
							},
							fontSizeHeaders: {
								type: "string",
								label: "Headers Font Size ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table headers font size",
								ref: "props.fontSizeHeaders",
								expression: "optional"
							},           
							headersTextAlignment: {
								type: 'string',
								component: 'item-selection-list',
								icon: true,
								horizontal: true,
								label: 'Headers Horizontal Alignment⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table headers text horizontal alignment',
								ref: 'props.headersTextAlignment',
								defaultValue: 'center',
								items: [{
									value: 'left',
									component: 'icon-item',
									icon: '🢦'
								}, {
									value: 'center',
									icon: '⦾',
									component: 'icon-item'
								}, {
									value: 'right',
									icon: '➪',
									component: 'icon-item'
								}]                        
							},
							headersVerticalAlignment: {
								type: 'string',
								component: 'item-selection-list',
								icon: true,
								horizontal: true,
								label: 'Headers Vertical Alignment⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table headers text vertical alignment',
								ref: 'props.headersVerticalAlignment',
								defaultValue: 'center',
								items: [{
									value: 'top',
									component: 'icon-item',
									icon: '⇧'
								}, {
									value: 'center',
									icon: '⦾',
									component: 'icon-item'
								}, {
									value: 'bottom',
									icon: '⇩',
									component: 'icon-item'
								}]                        
							},
							fontHeaders: {
								type: "string",
								label: "Headers Font Family⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table headers font family",
								ref: "props.fontHeaders",
								expression: "optional"
							},
							colorHeaders: {
								type: "string",
								label: "Headers Text Color⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the table headers text color in hex. example ='ff0000'",
								ref: "props.colorHeaders",
								expression: "optional"
							}
						}
					},
					columnFormatOptions: {
                        type: "items",
                        label: "Column formatting",
                        show: function(e) {
							return !e.props.useTemplate && (e.props.fileFormat || 'XLSX') == 'XLSX';
						},
						items: {
							ColumnsOptions: {
								type: "array",
								ref: "ColumnsOptions",
								label: "Columns Options⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nAdd one column options element for every field you want to custom format, the rest of the fields will keep the regular format",
								itemTitleRef: "props.excelcolumn",
								allowAdd: !0,
								allowRemove: !0,
								addTranslation: "Add Column Options",
								items: {
									excelcolumn: {
										type: "string",
										ref: "props.excelcolumn",
										label: "Column Name ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nThe column name to be custom formatted, as it is in the field label in the source table",
										expression: "optional"
									},
									dropColumn: {
										type: "boolean",
										label: "Drop Column ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nRemove the column from the exported file",
										ref: "props.dropColumn",
										defaultValue: false
									},
									hideColumn: {
										type: "boolean",
										label: "Hide Column ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nHide the column in the exported file",
										ref: "props.hideColumn",
										defaultValue: false,
										show: function(e) {
											return !e.props.dropColumn;
										}
									},           
									columnTextAlignment: {
										type: 'string',
										component: 'item-selection-list',
										icon: true,
										horizontal: true,
										label: 'Column horizontal alignment⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the Excel column text horizontal alignment',
										ref: 'props.columnTextAlignment',
										defaultValue: 'left',
										items: [{
											value: 'left',
											component: 'icon-item',
											icon: '🢦'
										}, {
											value: 'center',
											icon: '⦾',
											component: 'icon-item'
										}, {
											value: 'right',
											icon: '➪',
											component: 'icon-item'
										}],
										show: function(e) {
											return !e.props.dropColumn;
										}                        
									},
									ConditionalFormatting: {
										type: "array",
										ref: "ConditionalFormatting",
										label: "Conditional Formatting",
										itemTitleRef: "props.excelformula",
										allowAdd: !0,
										allowRemove: !0,
										addTranslation: "Add Cond. Format   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \r\nAdd conditional formatting to the column",
										items: {
											excelformula: {
												type: "string",
												ref: "props.excelformula",
												label: "Formula   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nThe excel Formula of the conditional Formatting, \r\nplaceholders:\r\n# - points to the current column\r\n~ points to another column\r\nfor example: \r\n #>=0 (this column value bigger than 0)\r\n L~># (L column value bigger than this column value)",
												expression: "optional"
											},
											excelformulacolor: {
												type: "string",
												ref: "props.excelformulacolor",
												label: "Conditional Font Color  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the font color to to be applied when condition is fulfilled \r\nin hex rgb - for example ff4400",
												expression: "optional"
											},
											excelformulabackcolor: {
												type: "string",
												ref: "props.excelformulabackcolor",
												label: "Conditional Back Color  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the background color to to be applied when condition is fulfilled \r\nin hex rgb - for example ff4400",
												expression: "optional"
											},
											excelformulabold: {
												type: "boolean",
												ref: "props.excelformulabold",
												label: "Conditional Font Bold  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the Font Bold to be applied when condition is fulfilled",
												defaultValue: false
											}
										}
									},
									fontcolor: {
										type: "string",
										ref: "props.fontcolor",
										label: "Column Font Color  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet a custom font color to the column in hex rgb - for example ff4400",
										expression: "optional",
										show: function(e) {
											return !e.props.dropColumn;
										}
									},
									backcolor: {
										type: "string",
										ref: "props.backcolor",
										label: "Column Back Color  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet a custom background color to the column in hex rgb - for example ff4400",
										expression: "optional",
										show: function(e) {
											return !e.props.dropColumn;
										}
									},
									excelfont: {
										type: "string",
										ref: "props.excelfont",
										label: "Column Font ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet a custom font to the column",
										expression: "optional",
										show: function(e) {
											return !e.props.dropColumn;
										}
									}, 
									excelformat: {
										type: "string",
										ref: "props.excelformat",
										label: "Column Format ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet a custom number or date format to the column",
										expression: "optional",
										show: function(e) {
											return !e.props.dropColumn;
										}
									},
									fontUnderlined: {
										type: "boolean",
										label: "Column Underline ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nUnderline the column text",
										ref: "props.fontUnderlined",
										defaultValue: false,
										show: function(e) {
											return !e.props.dropColumn;
										}
									},
									fontBold: {
										type: "boolean",
										label: "Column Bold ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nBold the column text",
										ref: "props.fontBold",
										defaultValue: false,
										show: function(e) {
											return !e.props.dropColumn;
										}
									},
									colWidth: {
										type: "integer",
										label: "Column Width ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nSet the column width (in points), leave 0 for default width\r\nto hide a column check \"Hide Column\" option",
										ref: "props.colWidth",
										expression: "optional",
										show: function(e) {
											return !e.props.dropColumn;
										}
									}													
								}
							},
							freezePanes: {
								type: "boolean",
								label: "Freeze Panes ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nKeep portion of the sheet visible on while the rest of the sheet scrolls",
								ref: "props.freezePanes",
								defaultValue: false
								
							},
							freezePaneCols: {
								type: "integer",
								label: "freeze Columns count⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\n Number of columns to keep visible on the side while the rest of the sheet scrolls",
								ref: "props.freezePaneCols",
								expression: "optional",
								show: function(e) {
									return e.props.freezePanes;
								}
							},
							freezePaneRows: {
								type: "integer",
								label: "freeze Rows count⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\n Number of rows to keep visible on top while the rest of the sheet scrolls",
								ref: "props.freezePaneRows",
								expression: "optional",
								show: function(e) {
									return e.props.freezePanes;
								}
							}
						}
					},
                    advanced: {
                        type: "items",
                        label: "Advanced",
                        items: {
                            manipulteJS : {
                                ref: "props.manipulteJS",
                                label: "API⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nCustomize your export using Excel JS API, for example \r\n=\'(\"Total Individual Claims\").range(15, 1, 15, 1).value(\"$(=GetFieldSelections([Vehicle Make])));\'\" \r\nsee snippets and examples in our website - https://logiexport.logsys.co.il/documentation",
                                type: "string",
								expression: "optional"
                            },
							manipulteJSBeforeStyle : {
                                ref: "props.manipulteJSBeforeStyle",
                                label: "API Before Styling⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nCustomize your export using Excel JS API, for example \r\n=\'(\"Total Individual Claims\").range(15, 1, 15, 1).value(\"$(=GetFieldSelections([Vehicle Make])));\'\" \r\nsee snippets and examples in our website - https://logiexport.logsys.co.il/documentation",
                                type: "string",
								expression: "optional"
                            },
							debugMode : {
                                ref: "props.debugMode",
                                label: "Debug Mode⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\nCheck if you wants to send bugs and performance reports to the dev team",
                                type: "boolean",
								defaultValue: true
                            }
                        }
                    },
					appearance: {
						uses: "settings",
						type:"items",
						label: "Appearance",
						items: {
							showTitles: {
								ref: "showTitles",
                                label: "Show titles",
                                type: "boolean",
								defaultValue: false
							}
						}
					},
					aboutPanel: {
						type:"items",
						label: "About",
						items: {
							about: {
								component: "LogicalAbout"
							}
						}
					}
                }

    }

});
