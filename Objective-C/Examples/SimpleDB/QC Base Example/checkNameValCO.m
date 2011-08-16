//
//  checkNameValCO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//

#import "CheckNameValCO.h"
#import "QCRequestHandler.h"

@implementation CheckNameValCO

+ (BOOL) handleIt:(NSMutableDictionary*) parameters{
    BOOL retVal = QC_STACK_EXIT;
    
    NSString *aName = [parameters objectForKey:@"name"];
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
