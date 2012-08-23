/*
* gcc -shared -Wl,-soname,libpst.so.1 -o libpst.so.1.0.1 debug.o libstrfunc.o lzfu.o timeconv.o vbuf.o libpst.o
*
*/

var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');

var file_name = '/mnt/hgfs/server/outlook.ost';

var pst_id2_tree = Struct({});

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
    'u1': 'int64',
});
	// struct pst_index_ll *next;
pst_index_ll.defineProperty('next', ref.refType(pst_index_ll));

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
    'data': 'pointer',
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

var pst_item = Struct({});

var pstfile_Ptr = ref.refType(pst_file);
var pstindexll_Ptr = ref.refType(pst_index_ll);
var pstxattribll_Ptr = ref.refType(pst_x_attrib_ll);
var pstblockrecorder_Ptr = ref.refType(pst_block_recorder);
var pstdesctree_Ptr = ref.refType(pst_desc_tree);
var filell_Ptr = ref.refType(file_ll);
var pstid2tree_Ptr = ref.refType(pst_id2_tree);
var pstitem_Ptr = ref.refType(pst_item);

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

	var ret = libpst.pst_open(f.ref(), file_name, null);
	if (ret !== -1) {
		console.log('File ' + f.fname + ' was opened successfully');
		console.log('Loading index...');
		libpst.pst_load_index(f.ref());
		console.log('Loading extended attributes...');
		libpst.pst_load_extended_attributes(f.ref());

		ref.writePointer(d_ptr, 0, f.d_head);
		item = libpst.pst_parse_item(f.ref(), d_ptr.ref(), NULL);
	}
	libpst.pst_close(f.ref());
}