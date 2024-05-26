<template>
    <!-- <header class="row">
        <div class="col-10">
            <div>
                <h2>{{prescriptionData['doctor_name']}}</h2>
                <p class="mb-0">{{prescriptionData['qualifications']}}</p>
                <p >{{formTranslation.common.no}}{{prescriptionData['id']}}</p>
            </div>
        <div>
            <p class="mt-5">{{prescriptionData['clinic_name']}}</p>
            <p class="mb-5">{{prescriptionData['clinic_address']}}</p>
        </div>
        </div>
        <div class="col-2">
            <p>{{formTranslation.common.date}} {{prescriptionData['encounter_date']}}</p>
            <p>{{formTranslation.common.patient}}: {{prescriptionData['patient_name']}}</p>    
        </div>
    </header>
    <div class="prescription">
        
        <table class="table table-md custom-table">
            <tr>
                <th>{{formTranslation.common.name}}</th>
                <th>{{formTranslation.patient_encounter.instruction}}</th>
                <th>{{formTranslation.patient_encounter.frequency}}</th>
                <th>{{formTranslation.patient_encounter.duration}}</th>
            </tr>
            <tr v-for="(prescription, index) in prescriptionList" v-if="prescription !== undefined" :key="index">
                <td>{{prescription.name.label}}</td>
                <td>{{ prescription.instruction }}</td>
                <td>{{ prescription.frequency.label }}</td>
                <td>{{ prescription.duration + ' Day'}}</td>
            </tr>
        </table>
    </div>
  <p style="text-align:right;">{{ formTranslation.widgets.dr_prefix }} {{prescriptionData['doctor_name']}}</p> -->
        <div class="container ">
            <div class="currentDate mb-3">{{ formTranslation.common.date }} : {{prescriptionData.date}}</div>
            <div class="head-content" :style="'border-bottom: 8px solid'+themeColor">
                <div class="hospital-content">
                    <img :src="prescriptionData.clinic_logo" class="logo">
                    <h3 class="hospital-name" :style="'color:'+themeColor"> {{prescriptionData.name}} </h3>
                </div>
                <div class="doc-header">
                    <div class="doctor-details">
                        <div class="doc-name">
                            <h2 class="name">{{ formTranslation.widgets.dr_prefix }}{{prescriptionData.doctor_name}}</h2>
                            <span class="doc-degree">{{prescriptionData.qualifications}}</span>
                        </div>
                        <div class="doc-address">
                            <p class="address">{{prescriptionData.clinic_address}}</p>
                        </div>
                    </div>
                    <div class="doc-contact">
                        <p class="contact">{{formTranslation.common.contact}}: {{prescriptionData.telephone_no}}</p>
                        <p class="contact"> {{formTranslation.doctor.dt_lbl_email}}: {{prescriptionData.email}}</p>
                    </div>
                </div>
            </div>
            <div class="body-content">
                <div class="patient-detail">
                    <div class="form-detail patient-name" style="display:flex;">
                        <h5 class="nameheading">{{formTranslation.common.patient}}: </h5>
                        <div class="fname patient-name-1">{{prescriptionData.patient_name}}</div>
                    </div>
                    <div class="form-detail patient-age" style="display:flex;">
                        <h5 class="nameheading">{{formTranslation.common.age}}: </h5>
                        <div class="fname patient-age-1">{{prescriptionData.patient_age}}</div>
                    </div>
                    <div class="form-detail patient-gender" style="display:flex;">
                        <h5 class="nameheading">{{formTranslation.common.gender}}: </h5>
                        <div class="fname patient-gender">{{prescriptionData.patient_gender}}</div>
                    </div>
                </div> 
                <div class="patient-detail" style="margin-top: 24px;">
                    <div class="form-detail patient-address" style="display:flex;">
                        <h5 class="nameheading">{{formTranslation.doctor.dt_lbl_email}}: </h5>
                        <div class="fname patient-address-1">{{prescriptionData.patient_email}}</div>
                    </div>                   
                    <div class="form-detail patient-contact" style="display:flex;">
                        <h5 class="nameheading">{{formTranslation.common.contact_no}}: </h5>
                        <div class="fname patient-contact-1">{{prescriptionData.contact_no}}</div>
                    </div>
                </div>
                  <table>
                    <caption style="margin-bottom:20px; text-align:center;caption-side: unset;font-size: 20px;font-weight: bold;">{{formTranslation.patient_encounter.prescription}}</caption>
                    <tr>
                      <th class="" :style="'border:1px solid ' + themeColor">{{formTranslation.common.name}}</th>
                      <th class="width-33" :style="'border:1px solid ' + themeColor">{{formTranslation.patient_encounter.instruction}}</th>
                      <th class="" :style="'border:1px solid ' + themeColor">{{formTranslation.patient_encounter.frequency}}</th>
                      <th class="" :style="'border:1px solid ' + themeColor">{{formTranslation.patient_encounter.duration}}</th>
                    </tr>
                    <tr v-for="(prescription, index) in prescriptionList" v-if="prescription !== undefined" :key="index">
                      <td class="" :style="'border:1px solid ' + themeColor">{{prescription.name.label}}</td>
                      <td class=" width-33" :style="'border:1px solid ' + themeColor">{{ prescription.instruction }}</td>
                      <td class="" :style="'border:1px solid ' + themeColor">{{ prescription.frequency.label }}</td>
                      <td class="" :style="'border:1px solid ' + themeColor">{{ prescription.duration + ' Day'}}</td>
                    </tr>
                  </table>
                   <div v-if="medical_history.show !== undefined && medical_history.show === 'true' && medical_history.count !== undefined && medical_history.count != '0'">
                 <table v-if="medical_history != undefined && medical_history != null">
                    <caption style="margin-bottom:20px; text-align:center;caption-side: unset;font-size: 20px;font-weight: bold;">{{formTranslation.encounter_dashboard.title}}</caption>
                    <tr>
                        <th v-if="medical_history.problem !== undefined">{{formTranslation.encounter_dashboard.problems}}</th>
                        <th v-if="medical_history.observation !== undefined">{{formTranslation.encounter_dashboard.observation}}</th>
                        <th v-if="medical_history.note !== undefined">{{formTranslation.encounter_dashboard.notes}}</th>   
                    </tr>
                     <tr v-for="(value, index) in medical_history.count"  :key="index">
                      <td v-if="medical_history.problem !== undefined" class="" :style="'border:1px solid ' + themeColor">{{medical_history.problem !== undefined && medical_history.problem[index] !== undefined ? medical_history.problem[index] : '' }}</td>
                      <td v-if="medical_history.observation !== undefined" class="" :style="'border:1px solid ' + themeColor">{{medical_history.observation !== undefined && medical_history.observation[index] !== undefined ? medical_history.observation[index] : '' }}</td>
                      <td v-if="medical_history.note !== undefined" class="" :style="'border:1px solid ' + themeColor">{{medical_history.note !== undefined && medical_history.note[index] !== undefined ? medical_history.note[index] : '' }}</td>
                    </tr>
                  </table>
                  </div>
            </div>
            <div class="footer mb-3">
                <div class="border-top" :style="'border:1px solid ' + themeColor"></div>
                <div class="d-flex" style="justify-content: end;">
                    <h2 style="margin: 0;">{{formTranslation.patient_encounter.doctor_signature}} </h2>
                    <div class="doc-line"></div>
                </div>
            </div>
        </div>

</template>

<script>
import {post, get} from "../../config/request";
export default {
    name:'Prescription',
    data: () => {
        return {
            services: [],
            prescriptionData: [],
            themeColor:'#4874dc',
            medical_history:[]
        }
    },
    mounted() {
        setTimeout(()=>{
            this.init();
        },1000)
        this.themeColor = window.request_data.color !== undefined ?  window.request_data.color : '#4874dc';
        get('get_prescription_print', {
                    id: this.encounterId
            })
                .then((data) => {
                    if (data.data.status !== undefined && data.data.status === true) {
                        this.prescriptionData = data.data.data
                        if(data.data.medical_history != undefined ){
                            this.medical_history =data.data.medical_history;
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);;
            })
    },
    props: {
        encounterId : {
            type: [ String, Number ],
            default() {
                return 0
            }
        },
        prescriptionList: {
            type: [Object, Array],
            default() {
                return {}
            }
        },
        encounterData: {
            type: [Object, Array],
            default() {
                return {}
            }
        }
    },
    methods: {
        init(){
       }
    },
    computed: {
        // formTranslation: function () {
        //     return this.$store.state.staticDataModule.langTranslateData ;
        // }
    }
}
</script>
    <style scoped>
    * {
        box-sizing: border-box;
    }
    :root {
        --primary-color: #876217;
        --white: #ffffff;
    }
    .container {
        background-color: #f2f2f2;
        padding: 20px;
    }
    .head-content{
        margin-bottom: 50px;
        padding-bottom: 30px;
        border-bottom: 8px solid ;
    }
    .hospital-content{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 65%;
    }
    .hospital-name{
        color: var(--primary-color);
        margin: 0;
        margin-left: 1rem;
        text-align: left;
        font-size: 30px
    }
    .logo{
        height: 100px;
        width: 100px;
    }
    .doctor-details{
        display: flex;
        flex-direction: column;
        width: 70%;
    }
    .doc-name{
        display: flex;
        align-items: flex-end;
        margin-bottom: 1rem;
    }
    .doc-name .name{
        margin: 0;
    }
    .doc-name .doc-degree{
        margin-left: 10px;
    }
    .doctor-details .doc-address .address{
        margin: 0;
    }
    .doc-contact{
        text-align: end;
    }
    .doc-contact .contact{
        margin: 0;
    }
    .doc-header{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 20px;
    }
    .form-textbox{
        border: 0;
        background: transparent;
        border-bottom: 1px solid;
    }
    .form-detail{
        margin-right: 20px;
    }
    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 2rem;
        /* background-color: red;
        color: white; */
        text-align: center;
    }
    .border-top{
        margin-bottom: 2rem;
    }
    .doc-line{
        position: relative;
        width: 30%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .doc-line:before {
        content: '';
        position: absolute;
        border-bottom: 1px solid #000;
        width: 100%;
        bottom: 0;
        left: 0;
    }
        .form-detail{
            /* display: flex; */
            align-items: end;
            font-size: 20px;
        }
        .fname{
            position: relative;
            width: 30%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0 10px;
        }
        .fname:before {
            content: '';
            position: absolute;
            /*border-bottom: 1px solid #000;*/
            width: 100%;
            bottom: 0;
            left: 0;
        }
        .patient-detail{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .width-33{
            width: 33%;
        }
        .patient-name{
            width: 60%;
        }
        .patient-name-1{
            width: 60%;
        }
        .patient-age{
            width: 20%;
        }
        .patient-age-1{
            width: 70%;
        }
        .patient-gender{
            width: 20%;
        }
        .patient-gender-1{
            width: 50%;
        }
        .patient-address{
            width: 80%;
        }
        .patient-address-1{
            width: 80%;
        }
        .patient-contact{
            width: 70%;
            display: flex;
            align-items:center;
            justify-content:flex-end
        }
        .patient-contact-1{
            width: 50%;
        }
        .nameheading{
            margin: 0;
            font-size: 20px;
        }
        table{
            margin-top: 50px;
            width:100%;
            border-radius:5px
        }
        th, td {
            padding: 20px;
        }
        .center{
            text-align: end;
        }
         @media print { 
            .container{
                margin-bottom: 0;
            }
            .form-detail {
                margin-right: 0px;
            }
            .currentDate{
                position: absolute;
                right: 1rem;
             }
            .patient-detail{
                justify-content: flex-start;
            }
            .patient-name{
                width: 60%;
            }
            .patient-age-1 {
                width: 40%;
            }
            .patient-contact-1 {
                width: 45%;
            }
             .patient-address{
               width: 100%;
             }
            @page {
                margin: 0;
            }
           .hospital-content{
             width: 55%;
           }
           table, th, td {
             border:1px solid var(--primary);
           }
           .border-top{
             border-bottom: 1px solid var(--primary);
             margin-bottom: 2rem;
           }
           .doc-line{
             left:0
           }
        } 
    </style>