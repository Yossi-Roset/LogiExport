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
					settings: {
                        type: "items",
                        label: "Button Settings",
                        items: {
						exportObjId : {
                                ref: "props.exportObjId",
                                label: "Object Id to Export⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ \r\nTip: LogiExport works best on table objects\r\nTip: use /options/developer menu",
                                type: "string",
                                expression: "optional"
                            },
                            buttonLabel: {
                                ref: "props.buttonLabel",
                                label: "Button Label",
                                type: "string",
                                expression: "optional",
								defaultValue: "Export"
                            },
							useTemplate: {
								type: "boolean",
								label: "Design by Template File",
								ref: "props.useTemplate",
								defaultValue: false				
							},
							dataAddress: {
								type: "string",
								ref: "props.dataAddress",
								label: "Paste Data Cell",
								expression: "optional",
								show: function(e) {
									return e.props.useTemplate;
								}
							}, 
							selAddress: {
								type: "string",
								ref: "props.selAddress",
								label: "Paste Selections Cell",
								expression: "optional",
								show: function(e) {
									return e.props.useTemplate;
								}
							},
							TemplateExplain: {
								component: {template: '<div class="pp-component pp-string-componen"><div class="message" style="color:red;">\
													Please make sure you delete the actual data from the xlsx file you use as a template!</div></div>'},
								show: function(e) {
									return e.props.useTemplate;
								}
							},
							uploadTemplate: {
								label: "Upload new Template",
								component: "uplButton",
								show: function(e) {
									return e.props.useTemplate;
								},
								action: function(data){
									//add your button action here
									upLogiExport(data);
								}
							},
							downloadTemplate: {
								label: "Download current Template",
								component: "button",
								show: function(e) {
									return e.props.useTemplate;
								},
								action: function(data){
									//add your button action here
									downLogiExport(data);
								}
							},
							pivotToTable: {
                                ref: "props.pivotToTable",
                                label: "Pivot To Table",
                                type: "boolean",
								defaultValue: false,
								show: false
                            }
						}
					},
					fileOptions: {
                        type: "items",
                        label: "File settings",
                        items: {
                            exportFileName: {
                                ref: "props.exportFileName",
                                label: "File name (optional)",
                                type: "string",
                                expression: "optional"
                            }
                        }
                    },
                    sheetFormatOptions: {
                        type: "items",
                        label: "Sheet formatting",						
						show: function(e) {
							return !e.props.useTemplate;
						},
						items: {
						    customSheetName: {
                                ref: "props.customSheetName",
                                label: "Custom Sheet Name",
                                type: "string",
                                expression: "optional"
                            },
							ReportCaption: {
                                ref: "props.reportCaption",
                                label: "Report Headline",
                                type: "string",
                                expression: "optional"
                            },
							RTLCheckbox: {
								type: "boolean",
								label: "Right To Left",
								ref: "props.RTL",
								defaultValue: false
							},
							keepOriginalColors: {
								type: "boolean",
								label: "Keep original colors (Beta)",
								ref: "props.keepOriginalColors",
								defaultValue: false,
								show: true
							},
							addSelectionsCheckbox: {
								type: "boolean",
								label: "Add Selection Context to File",
								ref: "props.addSelections",
								defaultValue: false
							},
							SelectionsLocation: {
								type: "string",
								label: "Selection Context Cell",
								expression: "optional",
								ref: "props.addSelectionsLocation",
								show: function(e) {
                                        return e.props.addSelections;
                                    }
							},
							addSelectionsLabel: {
								type: "string",
								label: "Selection Context Label",
								expression: "optional",
								ref: "props.addSelectionsLabel",
								show: function(e) {
                                        return e.props.addSelections;
                                    }
							},
							excludeColsFromSelections: {
								type: "string",
								label: "Fields Excluded from Selection Context",
								expression: "optional",
								ref: "props.excludeColsFromSelections",
								show: function(e) {
                                        return e.props.addSelections;
                                    }
							},
							addTotals: {
								type: "boolean",
								label: "Add Totals Row",
								ref: "props.addTotals",
								defaultValue: false
							},
							boldTotals: {
								type: "boolean",
								label: "Bold Totals Row",
								ref: "props.boldTotals",
								defaultValue: true,
								show: function(e) {
                                        return e.props.addTotals;
                                    }
							},
							borderColor: {
								type: "string",
								label: "Table Border Color",
								ref: "props.borderColor",
								expression: "optional"
							},
							borderStyle: {
								type: "string",
								component: "dropdown",
								label: "Table Border Style",
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
                        label: "Column header formatting",
                        show: function(e) {
							return !e.props.useTemplate;
						},
						items: {
							boldHeaders: {
								type: "boolean",
								label: "Bold Headers",
								ref: "props.boldHeaders",
								defaultValue: true
							},
							bgColorHeaders: {
								type: "string",
								label: "Headers Background Color",
								ref: "props.bgColorHeaders",
								expression: "optional"
							},
							wrapHeaders: {
								type: "boolean",
								label: "Headers Text Wrap",
								ref: "props.wrapHeaders"
							},
							fontSizeHeaders: {
								type: "string",
								label: "Headers Font Size",
								ref: "props.fontSizeHeaders",
								expression: "optional"
							},           
							headersTextAlignment: {
								type: 'string',
								component: 'item-selection-list',
								icon: true,
								horizontal: true,
								label: 'Headers Horizontal Alignment',
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
								label: 'Headers Vertical Alignment',
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
								label: "Headers Font Family",
								ref: "props.fontHeaders",
								expression: "optional"
							},
							colorHeaders: {
								type: "string",
								label: "Headers Text Color",
								ref: "props.colorHeaders",
								expression: "optional"
							}
						}
					},
					columnFormatOptions: {
                        type: "items",
                        label: "Column formatting",
                        show: function(e) {
							return !e.props.useTemplate;
						},
						items: {
							ColumnsOptions: {
								type: "array",
								ref: "ColumnsOptions",
								label: "Columns Options",
								itemTitleRef: "props.excelcolumn",
								allowAdd: !0,
								allowRemove: !0,
								addTranslation: "Add Column Options",
								items: {
									excelcolumn: {
										type: "string",
										ref: "props.excelcolumn",
										label: "Column Name ",
										expression: "optional"
									},
									dropColumn: {
										type: "boolean",
										label: "Drop Column",
										ref: "props.dropColumn",
										defaultValue: false
									},
									hideColumn: {
										type: "boolean",
										label: "Hide Column",
										ref: "props.hideColumn",
										defaultValue: false,
										show: function(e) {
											return !e.props.dropColumn;
										}
									},
									isLinkColumn: {
										type: "boolean",
										label: "Is Hyperlink",
										ref: "props.isLinkColumn",
										defaultValue: false,
										show: function(e) {
											return !e.props.dropColumn;
										}
									},
									linkTextOffset: {
										type: "integer",
										label: "Link Text Column Offset",
										ref: "props.linkTextOffset",
										defaultValue: 0,
										show: function(e) {
											return !e.props.dropColumn & e.props.isLinkColumn;
										}
									},           
									columnTextAlignment: {
										type: 'string',
										component: 'item-selection-list',
										icon: true,
										horizontal: true,
										label: 'Column horizontal alignment',
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
                                label: "API⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\n Customize your export using Excel JS API, for example \r\n=\'(\"Total Individual Claims\").range(15, 1, 15, 1).value(\"$(=GetFieldSelections([Vehicle Make])));\'\" \r\nsee snippets and examples in our website - https://logiexport.logsys.co.il/documentation",
                                type: "string",
								expression: "optional"
                            },
		            manipulteJSBeforeStyle : {
                                ref: "props.manipulteJSBeforeStyle",
                                label: "API Before Styling⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\n Customize your export using Excel JS API Before Styling is applied, for example \r\n=\'(\"Total Individual Claims\").range(15, 1, 15, 1).value(\"$(=GetFieldSelections([Vehicle Make])));\'\" \r\nsee snippets and examples in our website - https://logiexport.logsys.co.il/documentation",
                                type: "string",
								expression: "optional"
                            },
							debugMode : {
                                ref: "props.debugMode",
                                label: "Debug Mode⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\r\n Check if you wants to send bugs and performance reports to the dev team",
                                type: "boolean",
								defaultValue: true
                            }
                        }
                    },
					appearance: {
						uses: "settings",
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