var placeSearch, autocomplete;
let address = {
    country: '',
    province: '',
    district: '',
    ward: ''
}
let res = {
    country: '',
    province: '',
    district: '',
    ward: ''
}
let place;
function initAutocomplete() {

    // setTimeout(() => function () {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('txtADDRESS-inputEl'));

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_components',
        //'adr_address',
        'formatted_address',
        //'geometry',
        //'name',
        //'vicinity'
    ]);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
    //},1000);

}

function fillInAddress() {
    //reset address
    address = {
        country: '',
        province: '',
        district: '',
        ward: ''
    };
    res = {
        country: '',
        province: '',
        district: '',
        ward: ''
    };
    // Get the place details from the autocomplete object.
    place = autocomplete.getPlace();
    console.log(place);
    //custom
    if (place.address_components.length == 5) {
        //quốc gia
        //address.country = place.address_components.find(element => element.types[0] == 'country');
        address.country = place.address_components[4];
        //tỉnh/thành phố
        //address.province = place.address_components.find(element => element.types[0] == 'administrative_area_level_1');
        address.province = place.address_components[3];
        //quận huyện
        //address.district = place.address_components.find(element => element.types[0] == 'administrative_area_level_2');
        address.district = place.address_components[2];


    } else {
        //quốc gia
        address.country = place.address_components.find(element => element.types[0] == 'country');
        //tỉnh/thành phố
        address.province = place.address_components.find(element => element.types[0] == 'administrative_area_level_1');
        //quận huyện
        let temdistrict = place.address_components.find(element => element.types[0] == 'administrative_area_level_2');
        if (temdistrict == undefined) {
            temdistrict = place.address_components[1];
        }
        address.district = temdistrict;
        //phuong
        let tempward = place.address_components.find(element => element.types[0] == 'administrative_area_level_3');
        if (tempward != undefined) {
            address.ward = tempward.short_name.toLowerCase();
        }


    }
    //tách địa chỉ theo format "123 QL13, Hiệp Bình Chánh, Thủ Đức, Hồ Chí Minh"
    //0: số nhà + đường
    //1: phường
    //2: quận huyện
    //tỉnh/thành phố
    if (address.ward == undefined || address.ward == '') {
        let splitaddrs = place.formatted_address.split(',');
        let tempward = splitaddrs[1].split('.');
        if (tempward.length == 1)
            address.ward = tempward[0].trim();
        else address.ward = tempward[1].trim();
    }


    //tìm tỉnh trong store
    res.province = App.cbbPROVINCE.getStore().data.items.find(element => element.data.ZIP_DESC.toLowerCase().includes(address.province.short_name.toLowerCase()) || element.data.ZIP_DESC.includes(address.province.long_name.toLowerCase()));
    //gán cbb tỉnh
    App.cbbPROVINCE.setValue(res.province.data.ZIP_CD);
    //load huyện
    CompanyX.Load_District({
        success: function () {
            //tìm huyện trong store
            res.district = App.cbbDISTRICT.getStore().data.items.find(element => element.data.NAME.toLowerCase().includes(address.district.short_name.toLowerCase()) || element.data.NAME.toLowerCase().includes(address.district.long_name.toLowerCase()));
            //gán cbb huyện
            App.cbbDISTRICT.setValue(res.district.data.DISTRCODE);
            console.log(address.ward);
            CompanyX.Load_Ward({
                success: function () {
                    //tìm huyện trong store
                    res.ward = App.cbbWARD.getStore().data.items.find(element => element.data.NAME.toLowerCase().includes(address.ward.toLowerCase()));
                    //gán cbb huyện
                    if (res.ward != undefined)
                        App.cbbWARD.setValue(res.ward.data.WARDCODE);
                    else App.cbbWARD.setValue(0);
                }
            })
        }
    });
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
//list of component
//here https://developers.google.com/maps/documentation/javascript/reference/places-service?hl=vi#PlaceResult
//'address_components'
//'adr_address'
//'aspects'
//'business_status'
//'formatted_address'
//'formatted_phone_number'
//'geometry'
//'html_attributions'
//'icon'
//'international_phone_number'
//'name'
//'opening_hours'
//'permanently_closed'
//'photos'
//'place_id'
//'plus_code'
//'price_level'
//'rating'
//'reviews'
//'types'
//'url'
//'user_ratings_total'
//'utc_offset'
//'utc_offset_minutes'
//'vicinity'
//'website'
//function geolocate() {
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(function (position) {
//            var geolocation = {
//                lat: position.coords.latitude,
//                lng: position.coords.longitude
//            };
//            var circle = new google.maps.Circle(
//                { center: geolocation, radius: position.coords.accuracy });
//            autocomplete.setBounds(circle.getBounds());
//        });
//    }
//}
Ext.onReady(function () {
    setTimeout(() => initAutocomplete(), 1000);
});
