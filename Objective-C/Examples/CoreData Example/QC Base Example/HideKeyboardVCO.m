//
//  HideKeyboardVCO.m
//  QC Base Example
//
//  Created by Lee Barney on 9/18/12.
//
//

#import "HideKeyboardVCO.h"

@implementation HideKeyboardVCO
+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{
    UITextField *nameInput = [parameters objectForKey:@"nameInput"];
    if(nameInput){
        [nameInput endEditing:YES];
    }
    UITextField *urlInput = [parameters objectForKey:@"urlInput"];
    if (urlInput) {
        [urlInput endEditing:YES];
    }
    return QC_STACK_EXIT;
}
@end
