/*
* gcc -shared -Wl,-soname,libpst.so.1 -o libpst.so.1.0.1 debug.o libstrfunc.o lzfu.o timeconv.o vbuf.o libpst.o
*
*/

var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

var file_name = '/mnt/hgfs/server/outlook.ost';

/** The string is either utf8 encoded, or it is in the code page
 *  specified by the containing mapi object. It can be forced into
 *  utf8 by calling pst_convert_utf8() or pst_convert_utf8_null().
 */
var pst_string = Struct({
    /** @li 1 true
     *  @li 0 false 
    int     is_utf8;
    char   *str; */
    'is_utf8': 'int',
    'str': 'CString'
});

/** a simple wrapper for binary blobs */
var pst_binary = Struct({
    /*size_t  size;
    char   *data;*/
    'size': 'size_t',
    'data': 'CString'
});

var pst_entryid = Struct({
    /*int32_t u1;
    char entryid[16];
    uint32_t id;*/
    'u1': 'int32',
    'entryid': 'CString',
    'id': 'uint32'
});

var file_ll = Struct ({
    //char *dname;
    'dname': 'CString',
    //int32_t stored_count;
    'stored_count': 'int32',
    //int32_t item_count;
    'item_count': 'int32',
    //int32_t skip_count;
    'skip_count': 'int32',
    //int32_t type;
    'type': 'int32'
});

var pst_index_ll = Struct ({
    // uint64_t i_id;
    'i_id': 'uint64',
    // uint64_t offset;
    'offset': 'uint64',
    // uint64_t size;
    'size': 'uint64',
    // int64_t  u1;
    'u1': 'int64'
});
	// struct pst_index_ll *next;
pst_index_ll.defineProperty('next', ref.refType(pst_index_ll));

var pst_id2_tree = Struct({
    /*uint64_t            id2; */
    'id2': 'uint64'
});
    /*pst_index_ll        *id;
    struct pst_id2_tree *child;
    struct pst_id2_tree *next;*/
    pst_id2_tree.defineProperty('id', ref.refType(pst_index_ll));
    pst_id2_tree.defineProperty('child', ref.refType(pst_id2_tree));
    pst_id2_tree.defineProperty('next', ref.refType(pst_id2_tree));

/** This contains the email related mapi elements
 */
var pst_item_email = Struct({
    /** mapi element 0x0e06 PR_MESSAGE_DELIVERY_TIME 
    FILETIME   *arrival_date; */
    'arrival_date': 'pointer',
    /** mapi element 0x0002 PR_ALTERNATE_RECIPIENT_ALLOWED
     *  @li 1 true
     *  @li 0 not set
     *  @li -1 false 
    int         autoforward; */
    'autoforward': 'int',
    /** mapi element 0x3a03 PR_CONVERSION_PROHIBITED
     *  @li 1 true
     *  @li 0 false 
    int         conversion_prohibited; */
    'conversion_prohibited': 'int',
    /** mapi element 0x0e01 PR_DELETE_AFTER_SUBMIT
     *  @li 1 true
     *  @li 0 false 
    int         delete_after_submit; */
    'delete_after_submit': 'int',
    /** mapi element 0x0023 PR_ORIGINATOR_DELIVERY_REPORT_REQUESTED
     *  @li 1 true
     *  @li 0 false 
    int         delivery_report; */
    'delivery_report': 'int',
    /** mapi element 0x0017 PR_IMPORTANCE
     *  @li 0 low
     *  @li 1 normal
     *  @li 2 high 
    int32_t     importance; */
    'importance': 'int32',
    /** mapi element 0x0058 PR_MESSAGE_CC_ME, this user is listed explicitly in the CC address
     *  @li 1 true
     *  @li 0 false 
    int         message_cc_me; */
    'message_cc_me': 'int',
    /** mapi element 0x0059 PR_MESSAGE_RECIP_ME, this user appears in TO, CC or BCC address list
     *  @li 1 true
     *  @li 0 false 
    int         message_recip_me; */
    'message_recip_me': 'int',
    /** mapi element 0x0057 PR_MESSAGE_TO_ME, this user is listed explicitly in the TO address
     *  @li 1 true
     *  @li 0 false 
    int         message_to_me; */
    'message_to_me': 'int',
    /** mapi element 0x002e PR_ORIGINAL_SENSITIVITY
     *  @li 0=none
     *  @li 1=personal
     *  @li 2=private
     *  @li 3=company confidential 
    int32_t     original_sensitivity; */
    'original_sensitivity': 'int32',
    /** mapi element 0x0026 PR_PRIORITY
     *  @li 0 nonurgent
     *  @li 1 normal
     *  @li 2 urgent */
    /** mapi element  
    int32_t     priority; */
    'priority': 'int32',
    /** mapi element 0x0029 PR_READ_RECEIPT_REQUESTED
     *  @li 1 true
     *  @li 0 false 
    int         read_receipt; */
    'read_receipt': 'int',
    /** mapi element 0x0c17 PR_REPLY_REQUESTED
     *  @li 1 true
     *  @li 0 false 
    int         reply_requested; */
    'reply_requested': 'int',
    /** mapi element 0x1007 PR_RTF_SYNC_BODY_COUNT,
     *  a count of the *significant* charcters in the rtf body. Doesn't count
     *  whitespace and other ignorable characters. 
    int32_t     rtf_body_char_count; */
    'rtf_body_char_count': 'int32',
    /** mapi element 0x1006 PR_RTF_SYNC_BODY_CRC 
    int32_t     rtf_body_crc; */
    'rtf_body_crc': 'int32',
    /** mapi element 0x0e1f PR_RTF_IN_SYNC,
     *  True means that the rtf version is same as text body.
     *  False means rtf version is more up-to-date than text body.
     *  If this value doesn't exist, text body is more up-to-date than rtf and
     *  cannot update to the rtf.
     *  @li 1 true
     *  @li 0 false 
    int         rtf_in_sync; */
    'rtf_in_sync': 'int',
    /** mapi element 0x1010 PR_RTF_SYNC_PREFIX_COUNT,
     *  a count of the ignored characters before the first significant character 
    int32_t     rtf_ws_prefix_count; */
    'rtf_ws_prefix_count': 'int32',
    /** mapi element 0x1011 PR_RTF_SYNC_TRAILING_COUNT,
     *  a count of the ignored characters after the last significant character 
    int32_t     rtf_ws_trailing_count; */
    'rtf_ws_trailing_count': 'int32',
    /** mapi element 0x0036 PR_SENSITIVITY
     *  @li 0=none
     *  @li 1=personal
     *  @li 2=private
     *  @li 3=company confidential 
    int32_t     sensitivity; */
    'sensitivity': 'int32',
    /** mapi element 0x0039 PR_CLIENT_SUBMIT_TIME 
    FILETIME    *sent_date; */
    'sent_date': 'pointer',
    /** mapi element 0x0032 PR_REPORT_TIME, delivery report time 
    FILETIME   *report_time; */
    'report_time': 'pointer',
    /** mapi element 0x0c04 PR_NDR_REASON_CODE 
    int32_t     ndr_reason_code; */
    'ndr_reason_code': 'int32',
    /** mapi element 0x0c05 PR_NDR_DIAG_CODE 
    int32_t     ndr_diag_code; */
    'ndr_diag_code': 'int32',
    /** mapi element 0x0c20 PR_NDR_STATUS_CODE 
    int32_t     ndr_status_code; */
    'ndr_status_code': 'int32'
});
    /** mapi element 0x0e03 PR_DISPLAY_CC 
    pst_string  cc_address; */
    pst_item_email.defineProperty('cc_address', ref.refType(pst_string));
    /** mapi element 0x0e02 PR_DISPLAY_BCC 
    pst_string  bcc_address; */
    pst_item_email.defineProperty('bcc_address', ref.refType(pst_string));
    /** mapi element 0x0071 PR_CONVERSATION_INDEX 
    pst_binary  conversation_index; */
    pst_item_email.defineProperty('conversation_index', ref.refType(pst_binary));
    /** mapi element 0x6f04 
    pst_binary  encrypted_body; */
    pst_item_email.defineProperty('encrypted_body', ref.refType(pst_binary));
    /** mapi element 0x6f02 
    pst_binary  encrypted_htmlbody; */
    pst_item_email.defineProperty('encrypted_htmlbody', ref.refType(pst_binary));
    /** mapi element 0x007d PR_TRANSPORT_MESSAGE_HEADERS 
    pst_string  header; */
    pst_item_email.defineProperty('header', ref.refType(pst_string));
    /** mapi element 0x1013 
    pst_string  htmlbody; */
    pst_item_email.defineProperty('htmlbody', ref.refType(pst_string));
    /** mapi element 0x1042 
    pst_string  in_reply_to; */
    pst_item_email.defineProperty('in_reply_to', ref.refType(pst_string));
    /** mapi element 0x1035 
    pst_string  messageid; */
    pst_item_email.defineProperty('messageid', ref.refType(pst_string));
    /** mapi element 0x0072 PR_ORIGINAL_DISPLAY_BCC 
    pst_string  original_bcc; */
    pst_item_email.defineProperty('original_bcc', ref.refType(pst_string));
    /** mapi element 0x0073 PR_ORIGINAL_DISPLAY_CC 
    pst_string  original_cc; */
    pst_item_email.defineProperty('original_cc', ref.refType(pst_string));
    /** mapi element 0x0074 PR_ORIGINAL_DISPLAY_TO 
    pst_string  original_to; */
    pst_item_email.defineProperty('original_to', ref.refType(pst_string));
    /** mapi element 0x0051 PR_RECEIVED_BY_SEARCH_KEY 
    pst_string  outlook_recipient; */
    pst_item_email.defineProperty('outlook_recipient', ref.refType(pst_string));
    /** mapi element 0x0044 PR_RCVD_REPRESENTING_NAME 
    pst_string  outlook_recipient_name; */
    pst_item_email.defineProperty('outlook_recipient_name', ref.refType(pst_string));
    /** mapi element 0x0052 PR_RCVD_REPRESENTING_SEARCH_KEY 
    pst_string  outlook_recipient2; */
    pst_item_email.defineProperty('outlook_recipient2', ref.refType(pst_string));
    /** mapi element 0x003b PR_SENT_REPRESENTING_SEARCH_KEY 
    pst_string  outlook_sender; */
    pst_item_email.defineProperty('outlook_sender', ref.refType(pst_string));
    /** mapi element 0x0042 PR_SENT_REPRESENTING_NAME 
    pst_string  outlook_sender_name; */
    pst_item_email.defineProperty('outlook_sender_name', ref.refType(pst_string));
    /** mapi element 0x0c1d PR_SENDER_SEARCH_KEY 
    pst_string  outlook_sender2; */
    pst_item_email.defineProperty('outlook_sender2', ref.refType(pst_string));
    /** mapi element 0x0070 PR_CONVERSATION_TOPIC 
    pst_string  processed_subject; */
    pst_item_email.defineProperty('processed_subject', ref.refType(pst_string));
    /** mapi element 0x0075 PR_RECEIVED_BY_ADDRTYPE 
    pst_string  recip_access; */
    pst_item_email.defineProperty('recip_access', ref.refType(pst_string));
    /** mapi element 0x0076 PR_RECEIVED_BY_EMAIL_ADDRESS 
    pst_string  recip_address; */
    pst_item_email.defineProperty('recip_address', ref.refType(pst_string));
    /** mapi element 0x0077 PR_RCVD_REPRESENTING_ADDRTYPE 
    pst_string  recip2_access; */
    pst_item_email.defineProperty('recip2_access', ref.refType(pst_string));
    /** mapi element 0x0078 PR_RCVD_REPRESENTING_EMAIL_ADDRESS 
    pst_string  recip2_address; */
    pst_item_email.defineProperty('recip2_address', ref.refType(pst_string));
    /** mapi element 0x0050 PR_REPLY_RECIPIENT_NAMES 
    pst_string  reply_to; */
    pst_item_email.defineProperty('reply_to', ref.refType(pst_string));
    /** mapi element 0x1046, this seems to be the message-id of the rfc822 mail that is being returned 
    pst_string  return_path_address; */
    pst_item_email.defineProperty('return_path_address', ref.refType(pst_string));
    /** mapi element 0x1008 PR_RTF_SYNC_BODY_TAG,
     *  the first couple of lines of RTF body so that after modification, then beginning can
     *  once again be found. 
    pst_string  rtf_body_tag; */
    pst_item_email.defineProperty('rtf_body_tag', ref.refType(pst_string));
    /** mapi element 0x1009 PR_RTF_COMPRESSED,
     *  the compressed rtf body data.
     *  Use pst_lzfu_decompress() to retrieve the actual rtf body data. 
    pst_binary  rtf_compressed; */
    pst_item_email.defineProperty('rtf_compressed', ref.refType(pst_binary));
    /** mapi element 0x0064 PR_SENT_REPRESENTING_ADDRTYPE 
    pst_string  sender_access; */
    pst_item_email.defineProperty('sender_access', ref.refType(pst_string));
    /** mapi element 0x0065 PR_SENT_REPRESENTING_EMAIL_ADDRESS 
    pst_string  sender_address; */
    pst_item_email.defineProperty('sender_address', ref.refType(pst_string));
    /** mapi element 0x0c1e PR_SENDER_ADDRTYPE 
    pst_string  sender2_access; */
    pst_item_email.defineProperty('sender2_access', ref.refType(pst_string));
    /** mapi element 0x0c1f PR_SENDER_EMAIL_ADDRESS 
    pst_string  sender2_address; */
    pst_item_email.defineProperty('sender2_address', ref.refType(pst_string));
    /** mapi element 0x0e0a PR_SENTMAIL_ENTRYID 
    pst_entryid *sentmail_folder; */
    pst_item_email.defineProperty('sentmail_folder', ref.refType(pst_entryid));
    /** mapi element 0x0e04 PR_DISPLAY_TO 
    pst_string  sentto_address; */
    pst_item_email.defineProperty('sentto_address', ref.refType(pst_string));
    /** mapi element 0x1001 PR_REPORT_TEXT, delivery report dsn body 
    pst_string  report_text; */
    pst_item_email.defineProperty('report_text', ref.refType(pst_string));
    /** mapi element 0x0c1b PR_SUPPLEMENTARY_INFO 
    pst_string  supplementary_info; */
    pst_item_email.defineProperty('supplementary_info', ref.refType(pst_string));

/** This contains the folder related mapi elements
 */
var pst_item_folder = Struct({
    /** mapi element 0x3602 PR_CONTENT_COUNT 
    int32_t  item_count; */
    'item_count': 'int32',
    /** mapi element 0x3603 PR_CONTENT_UNREAD 
    int32_t  unseen_item_count; */
    'unseen_item_count': 'int32',
    /** mapi element 0x3617 PR_ASSOC_CONTENT_COUNT
        Associated content are items that are attached to this folder, but are hidden from users.
    
    int32_t  assoc_count; */
    'assoc_count': 'int32',
    /** mapi element 0x360a PR_SUBFOLDERS
     *  @li 1 true
     *  @li 0 false */
    /** mapi element  
    int      subfolder; */
    'subfolder': 'int'
});


/** This contains the message store related mapi elements
 */
var pst_item_message_store = Struct({
    /** mapi element 0x35df,
     *  bit mask of folders in this message store
     *  @li  0x1 FOLDER_IPM_SUBTREE_VALID
     *  @li  0x2 FOLDER_IPM_INBOX_VALID
     *  @li  0x4 FOLDER_IPM_OUTBOX_VALID
     *  @li  0x8 FOLDER_IPM_WASTEBOX_VALID
     *  @li 0x10 FOLDER_IPM_SENTMAIL_VALID
     *  @li 0x20 FOLDER_VIEWS_VALID
     *  @li 0x40 FOLDER_COMMON_VIEWS_VALID
     *  @li 0x80 FOLDER_FINDER_VALID 
    int32_t valid_mask; */
    'valid_mask': 'int32',
    /** mapi element 0x76ff 
    int32_t pwd_chksum; */
    'pwd_chksum': 'int32'
});
    /** mapi element 0x35e0 
    pst_entryid *top_of_personal_folder; */
    pst_item_message_store.defineProperty('top_of_personal_folder', ref.refType(pst_entryid));
    /** mapi element 0x35e2 
    pst_entryid *default_outbox_folder; */
    pst_item_message_store.defineProperty('default_outbox_folder', ref.refType(pst_entryid));
    /** mapi element 0x35e3 
    pst_entryid *deleted_items_folder; */
    pst_item_message_store.defineProperty('deleted_items_folder', ref.refType(pst_entryid));
    /** mapi element 0x35e4 
    pst_entryid *sent_items_folder; */
    pst_item_message_store.defineProperty('sent_items_folder', ref.refType(pst_entryid));
    /** mapi element 0x35e5 
    pst_entryid *user_views_folder; */
    pst_item_message_store.defineProperty('user_views_folder', ref.refType(pst_entryid));
    /** mapi element 0x35e6 
    pst_entryid *common_view_folder; */
    pst_item_message_store.defineProperty('common_view_folder', ref.refType(pst_entryid));
    /** mapi element 0x35e7 
    pst_entryid *search_root_folder; */
    pst_item_message_store.defineProperty('search_root_folder', ref.refType(pst_entryid));
    /** mapi element 0x7c07 
    pst_entryid *top_of_folder; */
    pst_item_message_store.defineProperty('top_of_folder', ref.refType(pst_entryid));


/** This contains the contact related mapi elements
 */
var pst_item_contact = Struct({

    /** mapi element 0x3a42 PR_BIRTHDAY 
    FILETIME   *birthday; */
    'birthday': 'pointer',
    /** mapi element 0x3a4d PR_GENDER
     *  @li 0 unspecified
     *  @li 1 female
     *  @li 2 male 
    int16_t     gender; */
    'gender': 'int16',
    /** mapi element 0x3a0e PR_MAIL_PERMISSION
     *  @li 1 true
     *  @li 0 false 
    int         mail_permission; */
    'mail_permission': 'int',
    /** mapi element 0x3a40 PR_SEND_RICH_INFO
     *  @li 1 true
     *  @li 0 false 
    int         rich_text; */
    'rich_text': 'int',
    /** mapi element 0x3a41 PR_WEDDING_ANNIVERSARY 
    FILETIME   *wedding_anniversary; */
    'wedding_anniversary': 'pointer'
});
    /** mapi element 0x3a00 PR_ACCOUNT 
    pst_string  account_name; */
    pst_item_contact.defineProperty('account_name', ref.refType(pst_string));
    /** mapi element 0x3003 PR_EMAIL_ADDRESS, or 0x8083 
    pst_string  address1; */
    pst_item_contact.defineProperty('address1', ref.refType(pst_string));
    /** mapi element 0x8085 
    pst_string  address1a; */
    pst_item_contact.defineProperty('address1a', ref.refType(pst_string));
    /** mapi element 0x8084 
    pst_string  address1_desc; */
    pst_item_contact.defineProperty('address1_desc', ref.refType(pst_string));
    /** mapi element 0x3002 PR_ADDRTYPE, or 0x8082 
    pst_string  address1_transport; */
    pst_item_contact.defineProperty('address1_transport', ref.refType(pst_string));
    /** mapi element 0x8093 
    pst_string  address2; */
    pst_item_contact.defineProperty('address2', ref.refType(pst_string));
    /** mapi element 0x8095 
    pst_string  address2a; */
    pst_item_contact.defineProperty('address2a', ref.refType(pst_string));
    /** mapi element 0x8094 
    pst_string  address2_desc; */
    pst_item_contact.defineProperty('address2_desc', ref.refType(pst_string));
    /** mapi element 0x8092 
    pst_string  address2_transport; */
    pst_item_contact.defineProperty('address2_transport', ref.refType(pst_string));
    /** mapi element 0x80a3 
    pst_string  address3; */
    pst_item_contact.defineProperty('address3', ref.refType(pst_string));
    /** mapi element 0x80a5 
    pst_string  address3a; */
    pst_item_contact.defineProperty('address3a', ref.refType(pst_string));
    /** mapi element 0x80a4 
    pst_string  address3_desc; */
    pst_item_contact.defineProperty('address3_desc', ref.refType(pst_string));
    /** mapi element 0x80a2 
    pst_string  address3_transport; */
    pst_item_contact.defineProperty('address3_transport', ref.refType(pst_string));
    /** mapi element 0x3a30 PR_ASSISTANT 
    pst_string  assistant_name; */
    pst_item_contact.defineProperty('assistant_name', ref.refType(pst_string));
    /** mapi element 0x3a2e PR_ASSISTANT_TELEPHONE_NUMBER 
    pst_string  assistant_phone; */
    pst_item_contact.defineProperty('assistant_phone', ref.refType(pst_string));
    /** mapi element 0x8535 
    pst_string  billing_information; */
    pst_item_contact.defineProperty('billing_information', ref.refType(pst_string));
    /** mapi element 0x801b 
    pst_string  business_address; */
    pst_item_contact.defineProperty('business_address', ref.refType(pst_string));
    /** mapi element 0x3a27 PR_BUSINESS_ADDRESS_CITY 
    pst_string  business_city; */
    pst_item_contact.defineProperty('business_city', ref.refType(pst_string));
    /** mapi element 0x3a26 PR_BUSINESS_ADDRESS_COUNTRY 
    pst_string  business_country; */
    pst_item_contact.defineProperty('business_country', ref.refType(pst_string));
    /** mapi element 0x3a24 PR_BUSINESS_FAX_NUMBER 
    pst_string  business_fax; */
    pst_item_contact.defineProperty('business_fax', ref.refType(pst_string));
    /** mapi element 0x3a51 PR_BUSINESS_HOME_PAGE 
    pst_string  business_homepage; */
    pst_item_contact.defineProperty('business_homepage', ref.refType(pst_string));
    /** mapi element 0x3a08 PR_BUSINESS_TELEPHONE_NUMBER 
    pst_string  business_phone; */
    pst_item_contact.defineProperty('business_phone', ref.refType(pst_string));
    /** mapi element 0x3a1b PR_BUSINESS2_TELEPHONE_NUMBER 
    pst_string  business_phone2; */
    pst_item_contact.defineProperty('business_phone2', ref.refType(pst_string));
    /** mapi element 0x3a2b PR_BUSINESS_PO_BOX 
    pst_string  business_po_box; */
    pst_item_contact.defineProperty('business_po_box', ref.refType(pst_string));
    /** mapi element 0x3a2a PR_BUSINESS_POSTAL_CODE 
    pst_string  business_postal_code; */
    pst_item_contact.defineProperty('business_postal_code', ref.refType(pst_string));
    /** mapi element 0x3a28 PR_BUSINESS_ADDRESS_STATE_OR_PROVINCE 
    pst_string  business_state; */
    pst_item_contact.defineProperty('business_state', ref.refType(pst_string));
    /** mapi element 0x3a29 PR_BUSINESS_ADDRESS_STREET
    pst_string  business_street; */
    pst_item_contact.defineProperty('business_street', ref.refType(pst_string));
    /** mapi element 0x3a02 PR_CALLBACK_TELEPHONE_NUMBER 
    pst_string  callback_phone; */
    pst_item_contact.defineProperty('callback_phone', ref.refType(pst_string));
    /** mapi element 0x3a1e PR_CAR_TELEPHONE_NUMBER 
    pst_string  car_phone; */
    pst_item_contact.defineProperty('car_phone', ref.refType(pst_string));
    /** mapi element 0x3a57 PR_COMPANY_MAIN_PHONE_NUMBER 
    pst_string  company_main_phone; */
    pst_item_contact.defineProperty('company_main_phone', ref.refType(pst_string));
    /** mapi element 0x3a16 PR_COMPANY_NAME 
    pst_string  company_name; */
    pst_item_contact.defineProperty('company_name', ref.refType(pst_string));
    /** mapi element 0x3a49 PR_COMPUTER_NETWORK_NAME 
    pst_string  computer_name; */
    pst_item_contact.defineProperty('computer_name', ref.refType(pst_string));
    /** mapi element 0x3a4a PR_CUSTOMER_ID 
    pst_string  customer_id; */
    pst_item_contact.defineProperty('customer_id', ref.refType(pst_string));
    /** mapi element 0x3a15 PR_POSTAL_ADDRESS 
    pst_string  def_postal_address; */
    pst_item_contact.defineProperty('def_postal_address', ref.refType(pst_string));
    /** mapi element 0x3a18 PR_DEPARTMENT_NAME 
    pst_string  department; */
    pst_item_contact.defineProperty('department', ref.refType(pst_string));
    /** mapi element 0x3a45 PR_DISPLAY_NAME_PREFIX 
    pst_string  display_name_prefix; */
    pst_item_contact.defineProperty('display_name_prefix', ref.refType(pst_string));
    /** mapi element 0x3a06 PR_GIVEN_NAME 
    pst_string  first_name; */
    pst_item_contact.defineProperty('first_name', ref.refType(pst_string));
    /** mapi element 0x8530 
    pst_string  followup; */
    pst_item_contact.defineProperty('followup', ref.refType(pst_string));
    /** mapi element 0x80d8 
    pst_string  free_busy_address; */
    pst_item_contact.defineProperty('free_busy_address', ref.refType(pst_string));
    /** mapi element 0x3a4c PR_FTP_SITE 
    pst_string  ftp_site; */
    pst_item_contact.defineProperty('ftp_site', ref.refType(pst_string));
    /** mapi element 0x8005 
    pst_string  fullname; */
    pst_item_contact.defineProperty('fullname', ref.refType(pst_string));
    /** mapi element 0x3a07 PR_GOVERNMENT_ID_NUMBER 
    pst_string  gov_id; */
    pst_item_contact.defineProperty('gov_id', ref.refType(pst_string));
    /** mapi element 0x3a43 PR_HOBBIES 
    pst_string  hobbies; */
    pst_item_contact.defineProperty('hobbies', ref.refType(pst_string));
    /** mapi element 0x801a 
    pst_string  home_address; */
    pst_item_contact.defineProperty('home_address', ref.refType(pst_string));
    /** mapi element 0x3a59 PR_HOME_ADDRESS_CITY 
    pst_string  home_city; */
    pst_item_contact.defineProperty('home_city', ref.refType(pst_string));
    /** mapi element 0x3a5a PR_HOME_ADDRESS_COUNTRY 
    pst_string  home_country; */
    pst_item_contact.defineProperty('home_country', ref.refType(pst_string));
    /** mapi element 0x3a25 PR_HOME_FAX_NUMBER 
    pst_string  home_fax; */
    pst_item_contact.defineProperty('home_fax', ref.refType(pst_string));
    /** mapi element 0x3a09 PR_HOME_TELEPHONE_NUMBER 
    pst_string  home_phone; */
    pst_item_contact.defineProperty('home_phone', ref.refType(pst_string));
    /** mapi element 0x3a2f PR_HOME2_TELEPHONE_NUMBER 
    pst_string  home_phone2; */
    pst_item_contact.defineProperty('home_phone2', ref.refType(pst_string));
    /** mapi element 0x3a5e PR_HOME_ADDRESS_POST_OFFICE_BOX 
    pst_string  home_po_box; */
    pst_item_contact.defineProperty('home_po_box', ref.refType(pst_string));
    /** mapi element 0x3a5b PR_HOME_ADDRESS_POSTAL_CODE 
    pst_string  home_postal_code; */
    pst_item_contact.defineProperty('home_postal_code', ref.refType(pst_string));
    /** mapi element 0x3a5c PR_HOME_ADDRESS_STATE_OR_PROVINCE 
    pst_string  home_state; */
    pst_item_contact.defineProperty('home_state', ref.refType(pst_string));
    /** mapi element 0x3a5d PR_HOME_ADDRESS_STREET 
    pst_string  home_street; */
    pst_item_contact.defineProperty('home_street', ref.refType(pst_string));
    /** mapi element 0x3a0a PR_INITIALS 
    pst_string  initials; */
    pst_item_contact.defineProperty('initials', ref.refType(pst_string));
    /** mapi element 0x3a2d PR_ISDN_NUMBER 
    pst_string  isdn_phone; */
    pst_item_contact.defineProperty('isdn_phone', ref.refType(pst_string));
    /** mapi element 0x3a17 PR_TITLE 
    pst_string  job_title; */
    pst_item_contact.defineProperty('job_title', ref.refType(pst_string));
    /** mapi element 0x3a0b PR_KEYWORD 
    pst_string  keyword; */
    pst_item_contact.defineProperty('keyword', ref.refType(pst_string));
    /** mapi element 0x3a0c PR_LANGUAGE 
    pst_string  language; */
    pst_item_contact.defineProperty('language', ref.refType(pst_string));
    /** mapi element 0x3a0d PR_LOCATION 
    pst_string  location; */
    pst_item_contact.defineProperty('location', ref.refType(pst_string));
    /** mapi element 0x3a4e PR_MANAGER_NAME 
    pst_string  manager_name; */
    pst_item_contact.defineProperty('manager_name', ref.refType(pst_string));
    /** mapi element 0x3a44 PR_MIDDLE_NAME 
    pst_string  middle_name; */
    pst_item_contact.defineProperty('middle_name', ref.refType(pst_string));
    /** mapi element 0x8534 
    pst_string  mileage; */
    pst_item_contact.defineProperty('mileage', ref.refType(pst_string));
    /** mapi element 0x3a1c PR_MOBILE_TELEPHONE_NUMBER 
    pst_string  mobile_phone; */
    pst_item_contact.defineProperty('mobile_phone', ref.refType(pst_string));
    /** mapi element 0x3a4f PR_NICKNAME 
    pst_string  nickname; */
    pst_item_contact.defineProperty('nickname', ref.refType(pst_string));
    /** mapi element 0x3a19 PR_OFFICE_LOCATION 
    pst_string  office_loc; */
    pst_item_contact.defineProperty('office_loc', ref.refType(pst_string));
    /** mapi element 0x3a0f PR_MHS_COMMON_NAME 
    pst_string  common_name; */
    pst_item_contact.defineProperty('common_name', ref.refType(pst_string));
    /** mapi element 0x3a10 PR_ORGANIZATIONAL_ID_NUMBER 
    pst_string  org_id; */
    pst_item_contact.defineProperty('org_id', ref.refType(pst_string));
    /** mapi element 0x801c 
    pst_string  other_address; */
    pst_item_contact.defineProperty('other_address', ref.refType(pst_string));
    /** mapi element 0x3a5f PR_OTHER_ADDRESS_CITY 
    pst_string  other_city; */
    pst_item_contact.defineProperty('other_city', ref.refType(pst_string));
    /** mapi element 0x3a60 PR_OTHER_ADDRESS_COUNTRY 
    pst_string  other_country; */
    pst_item_contact.defineProperty('other_country', ref.refType(pst_string));
    /** mapi element 0x3a1f PR_OTHER_TELEPHONE_NUMBER 
    pst_string  other_phone; */
    pst_item_contact.defineProperty('other_phone', ref.refType(pst_string));
    /** mapi element 0x3a64 PR_OTHER_ADDRESS_POST_OFFICE_BOX 
    pst_string  other_po_box; */
    pst_item_contact.defineProperty('other_po_box', ref.refType(pst_string));
    /** mapi element 0x3a61 PR_OTHER_ADDRESS_POSTAL_CODE 
    pst_string  other_postal_code; */
    pst_item_contact.defineProperty('other_postal_code', ref.refType(pst_string));
    /** mapi element 0x3a62 PR_OTHER_ADDRESS_STATE_OR_PROVINCE 
    pst_string  other_state; */
    pst_item_contact.defineProperty('other_state', ref.refType(pst_string));
    /** mapi element 0x3a63 PR_OTHER_ADDRESS_STREET 
    pst_string  other_street; */
    pst_item_contact.defineProperty('other_street', ref.refType(pst_string));
    /** mapi element 0x3a21 PR_PAGER_TELEPHOE_NUMBER 
    pst_string  pager_phone; */
    pst_item_contact.defineProperty('pager_phone', ref.refType(pst_string));
    /** mapi element 0x3a50 PR_PERSONAL_HOME_PAGE 
    pst_string  personal_homepage; */
    pst_item_contact.defineProperty('personal_homepage', ref.refType(pst_string));
    /** mapi element 0x3a47 PR_PREFERRED_BY_NAME 
    pst_string  pref_name; */
    pst_item_contact.defineProperty('pref_name', ref.refType(pst_string));
    /** mapi element 0x3a23 PR_PRIMARY_FAX_NUMBER 
    pst_string  primary_fax; */
    pst_item_contact.defineProperty('primary_fax', ref.refType(pst_string));
    /** mapi element 0x3a1a PR_PRIMARY_TELEPHONE_NUMBER 
    pst_string  primary_phone; */
    pst_item_contact.defineProperty('primary_phone', ref.refType(pst_string));
    /** mapi element 0x3a46 PR_PROFESSION 
    pst_string  profession; */
    pst_item_contact.defineProperty('profession', ref.refType(pst_string));
    /** mapi element 0x3a1d PR_RADIO_TELEPHONE_NUMBER 
    pst_string  radio_phone; */
    pst_item_contact.defineProperty('radio_phone', ref.refType(pst_string));
    /** mapi element 0x3a48 PR_SPOUSE_NAME 
    pst_string  spouse_name; */
    pst_item_contact.defineProperty('spouse_name', ref.refType(pst_string));
    /** mapi element 0x3a05 PR_GENERATION (Jr., Sr., III, etc) 
    pst_string  suffix; */
    pst_item_contact.defineProperty('suffix', ref.refType(pst_string));
    /** mapi element 0x3a11 PR_SURNAME 
    pst_string  surname; */
    pst_item_contact.defineProperty('surname', ref.refType(pst_string));
    /** mapi element 0x3a2c PR_TELEX_NUMBER 
    pst_string  telex; */
    pst_item_contact.defineProperty('telex', ref.refType(pst_string));
    /** mapi element 0x3a20 PR_TRANSMITTABLE_DISPLAY_NAME 
    pst_string  transmittable_display_name; */
    pst_item_contact.defineProperty('transmittable_display_name', ref.refType(pst_string));
    /** mapi element 0x3a4b PR_TTYTDD_PHONE_NUMBER 
    pst_string  ttytdd_phone; */
    pst_item_contact.defineProperty('ttytdd_phone', ref.refType(pst_string));
    /** mapi element 0x8045  
    pst_string  work_address_street; */
    pst_item_contact.defineProperty('work_address_street', ref.refType(pst_string));
    /** mapi element 0x8046 
    pst_string  work_address_city; */
    pst_item_contact.defineProperty('work_address_city', ref.refType(pst_string));
    /** mapi element 0x8047 
    pst_string  work_address_state; */
    pst_item_contact.defineProperty('work_address_state', ref.refType(pst_string));
    /** mapi element 0x8048 
    pst_string  work_address_postalcode; */
    pst_item_contact.defineProperty('work_address_postalcode', ref.refType(pst_string));
    /** mapi element 0x8049 
    pst_string  work_address_country; */
    pst_item_contact.defineProperty('work_address_country', ref.refType(pst_string));
    /** mapi element 0x804a 
    pst_string  work_address_postofficebox; */
    pst_item_contact.defineProperty('work_address_postofficebox', ref.refType(pst_string));

/** This contains the attachment related mapi elements
 */
var pst_item_attach = Struct({
    /** only used if the attachment is by reference, in which case this is the id2 reference 
    uint64_t        id2_val; */
    'id2_val': 'uint64',
    /** calculated from id2_val during creation of record 
    uint64_t        i_id; */
    'i_id': 'uint64',
    /** mapi element 0x3705 PR_ATTACH_METHOD
     *  @li 0 no attachment
     *  @li 1 attach by value
     *  @li 2 attach by reference
     *  @li 3 attach by reference resolve
     *  @li 4 attach by reference only
     *  @li 5 embedded message
     *  @li 6 OLE 
    int32_t         method; */
    'method': 'int32',
    /** mapi element 0x370b PR_RENDERING_POSITION 
    int32_t         position; */
    'position': 'int32',
    /** mapi element 0x3710 PR_ATTACH_MIME_SEQUENCE 
    int32_t         sequence; */
    'sequence': 'int32'
});
    /** mapi element 0x3704 PR_ATTACH_FILENAME 
    pst_string      filename1; */
    pst_item_attach.defineProperty('filename1', ref.refType(pst_string));
    /** mapi element 0x3707 PR_ATTACH_LONG_FILENAME 
    pst_string      filename2; */
    pst_item_attach.defineProperty('filename2', ref.refType(pst_string));
    /** mapi element 0x370e PR_ATTACH_MIME_TAG 
    pst_string      mimetype; */
    pst_item_attach.defineProperty('mimetype', ref.refType(pst_string));
    /** mapi element 0x3701 PR_ATTACH_DATA_OBJ 
    pst_binary      data; */
    pst_item_attach.defineProperty('data', ref.refType(pst_binary));
    /** id2 tree needed to resolve attachments by reference 
    pst_id2_tree    *id2_head; */
    pst_item_attach.defineProperty('id2_head', ref.refType(pst_id2_tree));
    //struct pst_item_attach *next;
    pst_item_attach.defineProperty('next', ref.refType(pst_item_attach));


/** linked list of extra header fields */
var pst_item_extra_field = Struct({
  /*  char   *field_name;
    char   *value; */
    'field_name': 'CString',
    'value': 'CString'
});
	//struct pst_item_extra_field *next;
	pst_item_extra_field.defineProperty('next', ref.refType(pst_item_extra_field));

/** This contains the recurrence data separated into fields.
    http://www.geocities.com/cainrandom/dev/MAPIRecurrence.html
*/
var pst_recurrence = Struct({
    /** 0x30043004 
    uint32_t    signature; */
    'signature': 'uint32',
    /** @li 0 daily
     *  @li 1 weekly
     *  @li 2 monthly
     *  @li 3 yearly 
    uint32_t    type; */
    'type': 'uint32',
    /** implies number of recurrence parameters
     *  @li 0 has 3 parameters
     *  @li 1 has 4 parameters
     *  @li 2 has 4 parameters
     *  @li 3 has 5 parameters
     
    uint32_t    sub_type; */
    'sub_type': 'uint32',
    /** must be contiguous, not an array to make python interface easier 
    uint32_t    parm1;
    uint32_t    parm2;
    uint32_t    parm3;
    uint32_t    parm4;
    uint32_t    parm5; */
    'param1': 'uint32',
    'param2': 'uint32',
    'param3': 'uint32',
    'param4': 'uint32',
    'param5': 'uint32',
    /** type of termination of the recurrence
        @li 0 terminates on a date
        @li 1 terminates based on integer number of occurrences
        @li 2 never terminates
     
    uint32_t    termination; */
    'termination': 'uint32',
    /** recurrence interval in terms of the recurrence type 
    uint32_t    interval; */
    'interval': 'uint32',
    /** bit mask of days of the week 
    uint32_t    bydaymask; */
    'bydaymask': 'uint32',
    /** day of month for monthly and yearly recurrences 
    uint32_t    dayofmonth; */
    'dayofmonth': 'uint32',
    /** month of year for yearly recurrences 
    uint32_t    monthofyear; */
    'monthofyear': 'uint32',
    /** occurence of day for 2nd Tuesday of month, in which case position is 2 
    uint32_t    position; */
    'position': 'uint32',
    /** number of occurrences, even if recurrence terminates based on date 
    uint32_t    count; */
    'count': 'uint32'
    // there is more data, including the termination date,
    // but we can get that from other mapi elements.
});

/** This contains the appointment related mapi elements
 */
var pst_item_appointment = Struct({
    /** mapi element 0x820d PR_OUTLOOK_EVENT_START_DATE 
    FILETIME   *start; */
    'start': 'pointer',
    /** mapi element 0x820e PR_OUTLOOK_EVENT_START_END 
    FILETIME   *end; */
    'end': 'pointer', 
    /** mapi element 0x8503 PR_OUTLOOK_COMMON_REMINDER_SET
     *  @li 1 true
     *  @li 0 false 
    int         alarm; */
    'alarm': 'int',
    /** mapi element 0x8560 
    FILETIME   *reminder; */
    'reminder': 'pointer',
    /** mapi element 0x8501 PR_OUTLOOK_COMMON_REMINDER_MINUTES_BEFORE 
    int32_t     alarm_minutes; */
    'alarm_minutes': 'int32',
    /** mapi element 0x8205 PR_OUTLOOK_EVENT_SHOW_TIME_AS
     *  @li 0 free
     *  @li 1 tentative
     *  @li 2 busy
     *  @li 3 out of office
    int32_t     showas; */
    'showas': 'int32',
    /** mapi element 0x8214
     *  @li 0 None
     *  @li 1 Important
     *  @li 2 Business
     *  @li 3 Personal
     *  @li 4 Vacation
     *  @li 5 Must Attend
     *  @li 6 Travel Required
     *  @li 7 Needs Preparation
     *  @li 8 Birthday
     *  @li 9 Anniversary
     *  @li 10 Phone Call 
    int32_t     label; */
    'label': 'int32',
    /** mapi element 0x8215 PR_OUTLOOK_EVENT_ALL_DAY
     *  @li 1 true
     *  @li 0 false 
    int         all_day; */
    'all_day': 'int',
    /** mapi element 0x8223 PR_OUTLOOK_EVENT_IS_RECURRING
     *  @li 1 true
     *  @li 0 false 
    int         is_recurring; */
    'is_recurring': 'int',
    /** mapi element 0x8231
     *  @li 0 none
     *  @li 1 daily
     *  @li 2 weekly
     *  @li 3 monthly
     *  @li 4 yearly 
    int32_t     recurrence_type; */
    'recurrence_type': 'int32',
    /** mapi element 0x8235 PR_OUTLOOK_EVENT_RECURRENCE_START 
    FILETIME   *recurrence_start; */
    'recurrence_start': 'pointer',
    /** mapi element 0x8236 PR_OUTLOOK_EVENT_RECURRENCE_END  
    FILETIME   *recurrence_end; */
    'recurrence_end': 'pointer'
});
    /** mapi element 0x8208 PR_OUTLOOK_EVENT_LOCATION 
    pst_string  location; */
    pst_item_appointment.defineProperty('location', ref.refType(pst_string));
    /** mapi element 0x851f 
    pst_string  alarm_filename; */
    pst_item_appointment.defineProperty('alarm_filename', ref.refType(pst_string));
    /** mapi element 0x8234 
    pst_string  timezonestring; */
    pst_item_appointment.defineProperty('timezonestring', ref.refType(pst_string));
    /** mapi element 0x8232 recurrence description 
    pst_string  recurrence_description; */
    pst_item_appointment.defineProperty('recurrence_description', ref.refType(pst_string));
    /** mapi element 0x8216 recurrence data 
    pst_binary  recurrence_data; */
    pst_item_appointment.defineProperty('recurrence_data', ref.refType(pst_binary));

/** This contains the journal related mapi elements
 */
var pst_item_journal = Struct({
    /** mapi element 0x8706 
    FILETIME   *start; */
    'start': 'pointer',
    /** mapi element 0x8708 
    FILETIME   *end; */
    'end': 'pointer'
});
    /** mapi element 0x8700 
    pst_string  type; */
    pst_item_journal.defineProperty('type', ref.refType(pst_string));
    /** mapi element 0x8712 
    pst_string  description; */
    pst_item_journal.defineProperty('description', ref.refType(pst_string));


var pst_x_attrib_ll = Struct ({
    /** @li 1 PST_MAP_ATTRIB map->int attribute
        @li 2 PST_MAP_HEADER map->string header
     
    uint32_t mytype; */
    'mytype': 'uint32',
    /** key for the mapping 
    uint32_t map; */
    'map': 'uint32',
    /** data target of the mapping, either uint32_t or string 
    void     *data; */
    'data': 'pointer'
});
    /** link to next item in the list 
    struct pst_x_attrib_ll *next; */
pst_x_attrib_ll.defineProperty('next', ref.refType(pst_x_attrib_ll));

var pst_desc_tree = Struct ({
    //uint64_t              d_id;
    'd_id': 'uint64',
    //uint64_t              parent_d_id;
    'parent_d_id': 'uint64',
    //int32_t               no_child;
    'no_child': 'int32'
});
    //pst_index_ll         *desc;
pst_desc_tree.defineProperty('desc', ref.refType(pst_index_ll));
    //pst_index_ll         *assoc_tree;
pst_desc_tree.defineProperty('assoc_tree', ref.refType(pst_index_ll));
    //struct pst_desc_tree *prev;
pst_desc_tree.defineProperty('prev', ref.refType(pst_desc_tree));
    //struct pst_desc_tree *next;
pst_desc_tree.defineProperty('next', ref.refType(pst_desc_tree));
    //struct pst_desc_tree *parent;
pst_desc_tree.defineProperty('parent', ref.refType(pst_desc_tree));
    //struct pst_desc_tree *child;
pst_desc_tree.defineProperty('child', ref.refType(pst_desc_tree));
    //struct pst_desc_tree *child_tail;
pst_desc_tree.defineProperty('child_tail', ref.refType(pst_desc_tree));

var pst_block_recorder = Struct ({
    //int64_t                     offset;
    'offset': 'int64',
    //size_t                      size;
    'size': 'size_t',
    //int                         readcount;
    'readcount': 'int'
});
    //struct pst_block_recorder  *next;
pst_block_recorder.defineProperty('next', ref.refType(pst_block_recorder));

var pst_file = Struct({
    /** file pointer to opened PST file
    FILE*   fp; */
    'fp': 'pointer',
    /** original cwd when the file was opened 
    char*   cwd; */
    'cwd': 'CString',
    /** original file name when the file was opened 
    char*   fname; */
    'fname': 'CString',
    /** default character set for items without one 
    char*   charset; */
    'charset': 'CString',
    /** @li 0 is 32-bit pst file, pre Outlook 2003;
     *  @li 1 is 64-bit pst file, Outlook 2003 or later 
    int do_read64; */
    'do_read64': 'int',
    /** file offset of the first b-tree node in the index tree 
    uint64_t index1; */
    'index1': 'uint64',
    /** back pointer value in the first b-tree node in the index tree 
    uint64_t index1_back; */
    'index1_back': 'uint64',
    /** file offset of the first b-tree node in the descriptor tree
    uint64_t index2; */
    'index2': 'uint64',
    /** back pointer value in the first b-tree node in the descriptor tree 
    uint64_t index2_back; */
    'index2_back': 'uint64',
    /** size of the pst file 
    uint64_t size; */
    'size': 'uint64',
    /** @li 0 PST_NO_ENCRYPT, none
     *  @li 1 PST_COMP_ENCRYPT, simple byte substitution cipher with fixed key
     *  @li 2 PST_ENCRYPT, german enigma 3 rotor cipher with fixed key 
    unsigned char encryption; */
    'encryption': 'uchar',
    /** index type or file type
     *  @li 0x0e 32 bit pre Outlook 2003
     *  @li 0x0f 32 bit pre Outlook 2003
     *  @li 0x15 64 bit Outlook 2003 or later
     *  @li 0x17 64 bit Outlook 2003 or later 
    unsigned char ind_type; */
    'ind_type': 'uchar'
});
    /** the head and tail of the linked list of index structures 
    pst_index_ll *i_head, *i_tail; */
pst_file.defineProperty('i_head', ref.refType(pst_index_ll));
pst_file.defineProperty('i_tail', ref.refType(pst_index_ll));
    /** the head and tail of the top level of the descriptor tree 
    pst_desc_tree  *d_head, *d_tail; */
pst_file.defineProperty('d_head', ref.refType(pst_desc_tree));
pst_file.defineProperty('d_tail', ref.refType(pst_desc_tree));
    /** the head of the extended attributes linked list 
    pst_x_attrib_ll *x_head; */
pst_file.defineProperty('x_head', ref.refType(pst_x_attrib_ll));
    /** the head of the block recorder, a debug artifact
     *  used to detect cases where we might read the same
     *  block multiple times while processing a pst file. 
    pst_block_recorder *block_head; */
pst_file.defineProperty('block_head', ref.refType(pst_block_recorder));

var pst_item = Struct({
    /** block id that can be used to generate uid 
    uint64_t               block_id; */
    'block_id': 'uint64',
    /** derived from mapi elements 0x001a PR_MESSAGE_CLASS or 0x3613 PR_CONTAINER_CLASS
     *  @li  1 PST_TYPE_NOTE
     *  @li  2 PST_TYPE_SCHEDULE
     *  @li  8 PST_TYPE_APPOINTMENT
     *  @li  9 PST_TYPE_CONTACT
     *  @li 10 PST_TYPE_JOURNAL
     *  @li 11 PST_TYPE_STICKYNOTE
     *  @li 12 PST_TYPE_TASK
     *  @li 13 PST_TYPE_OTHER
     *  @li 14 PST_TYPE_REPORT 
    int         type; */
    'type': 'int',
    /** mapi element 0x001a PR_MESSAGE_CLASS or 0x3613 PR_CONTAINER_CLASS 
    char       *ascii_type; */
    'ascii_type': 'CString',
    /** mapi element 0x0e07 PR_MESSAGE_FLAGS
     *  @li 0x01 Read
     *  @li 0x02 Unmodified
     *  @li 0x04 Submit
     *  @li 0x08 Unsent
     *  @li 0x10 Has Attachments
     *  @li 0x20 From Me
     *  @li 0x40 Associated
     *  @li 0x80 Resend
     *  @li 0x100 RN Pending
     *  @li 0x200 NRN Pending 
    int32_t     flags; */
    'flags': 'int32',

    /** mapi element 0x3fde PR_INTERNET_CPID 
    int32_t     internet_cpid; */
    'internet_cpid': 'int32',
    /** mapi element 0x3ffd PR_MESSAGE_CODEPAGE 
    int32_t     message_codepage; */
    'message_codepage': 'int32',
    /** mapi element 0x0e08 PR_MESSAGE_SIZE 
    int32_t     message_size; */
    'message_size': 'int32',
    /** mapi element 0x0063 PR_RESPONSE_REQUESTED
     *  @li 1 true
     *  @li 0 false 
    int         response_requested; */
    'response_requested': 'int',
    /** mapi element 0x3007 PR_CREATION_TIME 
    FILETIME   *create_date; */
    'create_date': 'pointer',
    /** mapi element 0x3008 PR_LAST_MODIFICATION_TIME 
    FILETIME   *modify_date; */
    'modify_date': 'pointer',
    /** mapi element 0x002b PR_RECIPIENT_REASSIGNMENT_PROHIBITED
     *  @li 1 true
     *  @li 0 false 
    int         private_member; */
    'private_member': 'int'
});
    /** pointer to the pst_file 
    struct pst_file        *pf; */
    pst_item.defineProperty('pf', ref.refType(pst_file));
    /** email mapi elements 
    pst_item_email         *email; */
    pst_item.defineProperty('email', ref.refType(pst_item_email));
    /** folder mapi elements 
    pst_item_folder        *folder; */
    pst_item.defineProperty('folder', ref.refType(pst_item_folder));
    /** contact mapi elements 
    pst_item_contact       *contact; */
    pst_item.defineProperty('contact', ref.refType(pst_item_contact));
    /** linked list of attachments 
    pst_item_attach        *attach;  */
    pst_item.defineProperty('attach', ref.refType(pst_item_attach));
    /** message store mapi elements 
    pst_item_message_store *message_store; */
    pst_item.defineProperty('message_store', ref.refType(pst_item_message_store));
    /** linked list of extra headers and such 
    pst_item_extra_field   *extra_fields; */
    pst_item.defineProperty('extra_fields', ref.refType(pst_item_extra_field));
    /** journal mapi elements 
    pst_item_journal       *journal; */
    pst_item.defineProperty('journal', ref.refType(pst_item_journal));
    /** calendar mapi elements 
    pst_item_appointment   *appointment; */
    pst_item.defineProperty('appointment', ref.refType(pst_item_appointment));
    /** mapi element 0x3001 PR_DISPLAY_NAME 
    pst_string  file_as; */
    pst_item.defineProperty('file_as', ref.refType(pst_string));
    /** mapi element 0x3004 PR_COMMENT 
    pst_string  comment; */
    pst_item.defineProperty('comment', ref.refType(pst_string));
    /** derived from extra_fields["content-type"] if it contains a charset= subfield  
    pst_string  body_charset; */
    pst_item.defineProperty('body_charset', ref.refType(pst_string));
    /** mapi element 0x1000 PR_BODY 
    pst_string  body; */
    pst_item.defineProperty('body', ref.refType(pst_string));
    /** mapi element 0x0037 PR_SUBJECT 
    pst_string  subject; */
    pst_item.defineProperty('subject', ref.refType(pst_string));
    /** mapi element 0x8554 PR_OUTLOOK_VERSION 
    pst_string  outlook_version; */
    pst_item.defineProperty('outlook_version', ref.refType(pst_string));
    /** mapi element 0x0ff9 PR_RECORD_KEY 
    pst_binary  record_key; */
    pst_item.defineProperty('record_key', ref.refType(pst_binary));
    /** mapi element 0x65e3 PR_PREDECESSOR_CHANGE_LIST 
    pst_binary  predecessor_change; */
    pst_item.defineProperty('predecessor_change', ref.refType(pst_binary));

var pstfile_Ptr = ref.refType(pst_file);
var pstindexll_Ptr = ref.refType(pst_index_ll);
var pstxattribll_Ptr = ref.refType(pst_x_attrib_ll);
var pstblockrecorder_Ptr = ref.refType(pst_block_recorder);
var pstdesctree_Ptr = ref.refType(pst_desc_tree);
var filell_Ptr = ref.refType(file_ll);
var pstid2tree_Ptr = ref.refType(pst_id2_tree);
var pstitem_Ptr = ref.refType(pst_item);
var pststring_Ptr = ref.refType(pst_string);
var pstbinary_Ptr = ref.refType(pst_binary);

var libpst = new ffi.Library('../libpst.so.1.0.1', {
	'pst_open': ['int', [pstfile_Ptr, 'CString', 'CString']],
	'pst_close': ['int', [pstfile_Ptr]],
	'pst_load_index': ['int', [pstfile_Ptr]],
	'pst_load_extended_attributes': ['int', [pstfile_Ptr]],
	'pst_parse_item': [pstitem_Ptr, [pstfile_Ptr, pstdesctree_Ptr, pstid2tree_Ptr]]
});

if (libpst) {
	var f = new pst_file();
	var descTree = new pst_desc_tree();
	var d_ptr = ref.alloc(pstdesctree_Ptr);
	var item = ref.alloc(pstitem_Ptr);
	var temp = ref.alloc(pststring_Ptr);

	var ret = libpst.pst_open(f.ref(), file_name, null);
	if (ret !== -1) {
		console.log('File ' + f.fname + ' was opened successfully');
		console.log('Loading index...');
		libpst.pst_load_index(f.ref());
		console.log('Loading extended attributes...');
		libpst.pst_load_extended_attributes(f.ref());

		var t = ref.readPointer(f.d_head, 0);
		console.log(t);
		
/*		ref.writePointer(d_ptr, 0, f.d_head);
		console.log('parsing first item...');
		item = libpst.pst_parse_item(f.ref(), d_ptr.ref(), null);
		
		ref.writePointer(temp, 0, item.subject);
		ref.readCString(temp, )
		console.log('email: ', temp);
*/
	}
	libpst.pst_close(f.ref());
}