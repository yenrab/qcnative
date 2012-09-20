//
//  checkNameValCO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//

#import "CheckNameValCO.h"
#import "QCRequestHandler.h"

@implementation CheckNameValCO

+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{
    BOOL retVal = QC_STACK_EXIT;
    UITextView *nameInput = [parameters objectForKey:@"nameInput"];
    NSString *aName = nameInput.text;
    [parameters setValue:aName forKey:@"name"];
    aName = [aName stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    if ([aName length] > 0) {
        retVal = QC_STACK_CONTINUE;
    }
    else{
        //an example of how to handle a validation failure
        QCRequestHandler *theHandler = [parameters objectForKey:@"qcrequest handler"];
        [theHandler dispatchToECO:@"missingValue" withParameters:parameters];
    }
    
    return retVal;
}

@end
